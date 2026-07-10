import { Hono } from 'hono';
import { validator } from 'hono-openapi';
import * as v from 'valibot';
import { CaptureRepository, captureSchema, type Capture } from '$lib/repository/captureRepository';
import { loggers } from '$lib/utilities/loggers';
import { rag } from '$lib/utilities/rag';
import { and, eq, inArray } from 'drizzle-orm';
import { captureChunkTable, captureTable } from '$lib/utilities/schema';
import { scrape } from '@compeer-ai/scrape';
import { db } from '$lib/utilities/sqlite';

const captureRepository = new CaptureRepository();
const Type = {
	text: 'text',
	data: 'data',
	url: 'url'
} as const;

export const readSearchCapturesParamsSchema = v.object({
	store: v.optional(v.string()),
	workspace: v.string(),
	query: v.string()
});
export const readCapturesParamsSchema = v.object({
	storeId: v.string(),
	offset: v.optional(v.number()),
	limit: v.optional(v.number())
});
export const createCaptureSchema = v.object({
	type: v.enum(Type),
	content: v.string(),
	storeId: v.string()
});
export const createCapturesSchema = v.object({
	captures: v.array(captureSchema)
});
export const updateCaptureEnabledSchema = v.object({
	id: v.string(),
	enabled: v.boolean(),
	storeId: v.string()
});
export const updateCaptureSchema = v.object({
	id: v.string(),
	enabled: v.optional(v.boolean(), false),
	originalContent: v.string(),
	originalUrl: v.optional(v.string()),
	content: v.string(),
	storeId: v.string(),
	type: v.enum(Type)
});
export const deleteCaptureSchema = v.object({
	id: v.string(),
	storeId: v.string()
});
export const deleteCapturesSchema = v.object({
	captureIds: v.array(v.string()),
	storeId: v.string()
});

export const captureRouter = new Hono()
	.get(
		'read_search_captures',
		validator('param', readSearchCapturesParamsSchema),
		async (ctx) => {
			const { query, store, workspace } = ctx.req.valid('param');
			const context = store
				? await rag.projectContext(query, workspace, store)
				: await rag.mainContext(query, workspace);
			return ctx.json(context);
		}
	)
	.get(
		'read_captures',
		validator('param', readCapturesParamsSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('param');
			const result = await captureRepository.readByPredicate(
				eq(captureTable.storeId, validatedPayload.storeId),
				validatedPayload.offset,
				validatedPayload.limit
			);
			const captures = result.all();
			const formattedCaptures = captures.map(({ embedding, ...others }) => others);
			return ctx.json(formattedCaptures);
		}
	)
	.post(
		'create_capture',
		validator('json', createCaptureSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('json');
			const { type, storeId } = validatedPayload;
			let { content } = validatedPayload;
			let url: string | undefined;
			if (type === 'url') {
				url = content;
				content = await scrape.regex(fetch, url);
			}
			const { embedding } = await rag.embed(content);
			const chunkEmbeddings = await rag.embedChunks(content);
			const payload = {
				content,
				embedding,
				url,
				type,
				storeId
			};
			const result = await captureRepository.create(payload);
			const createdCapture = result.first();
			if (chunkEmbeddings.length > 0) {
				await db.insert(captureChunkTable).values(
					chunkEmbeddings.map((chunk) => ({
						captureId: createdCapture.id,
						content: chunk.content,
						embedding: chunk.embedding
					}))
				);
			}
			loggers.data.info('Created capture');
			return ctx.json(createdCapture);
		}
	)
	.post(
		'create_captures',
		validator('json', createCapturesSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('json');
			const result = await captureRepository.createMany(validatedPayload.captures as Capture[]);
			return ctx.json(result.first());
		}
	)
	.patch(
		'update_capture_enabled',
		validator('json', updateCaptureEnabledSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('json');
			await captureRepository.updateByPredicate(
				validatedPayload.id,
				eq(captureTable.storeId, validatedPayload.storeId),
				{
					enabled: validatedPayload.enabled
				}
			);
			return ctx.json({ success: true });
		}
	)
	.put(
		'update_capture',
		validator('json', updateCaptureSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('json');
			const { content, enabled, id, type } = validatedPayload;
			let embedding: number[] | undefined;
			let url: string | undefined;
			let textToEmbed: string = content;
			let contentToStore: string = content;
			let chunkEmbeddings: { content: string; embedding: number[] }[] | undefined;
			let contentChanged = content !== validatedPayload.originalContent;

			if (type === 'url') {
				url = content;
				const originalUrl = validatedPayload.originalUrl;
				const urlChanged = originalUrl ? url !== originalUrl : contentChanged;
				contentChanged = urlChanged;
				if (urlChanged) {
					textToEmbed = await scrape.regex(fetch, url);
					contentToStore = textToEmbed;
				} else {
					contentToStore = validatedPayload.originalContent;
					textToEmbed = contentToStore;
				}
			}

			if (contentChanged) {
				const embeddingResult = await rag.embed(textToEmbed);
				embedding = embeddingResult.embedding;
				chunkEmbeddings = await rag.embedChunks(textToEmbed);
			}

			const payload = {
				embedding,
				enabled,
				content: contentToStore,
				url
			};
			await captureRepository.updateByPredicate(
				id,
				eq(captureTable.storeId, validatedPayload.storeId),
				payload
			);
			if (contentChanged) {
				await db.delete(captureChunkTable).where(eq(captureChunkTable.captureId, id));
				if (chunkEmbeddings && chunkEmbeddings.length > 0) {
					await db.insert(captureChunkTable).values(
						chunkEmbeddings.map((chunk) => ({
							captureId: id,
							content: chunk.content,
							embedding: chunk.embedding
						}))
					);
				}
			}
			loggers.data.info('Updated capture');
			return ctx.json({ success: true });
		}
	)
	.delete(
		'delete_capture',
		validator('json', deleteCaptureSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('json');
			await captureRepository.deleteById(validatedPayload.id);
			loggers.data.info('Deleted capture');
			return ctx.body(null, 204);
		}
	)
	.delete(
		'delete_captures',
		validator('json', deleteCapturesSchema),
		async (ctx) => {
			const validatedPayload = ctx.req.valid('json');
			await captureRepository.deleteByPredicate(
				and(
					eq(captureTable.storeId, validatedPayload.storeId),
					inArray(captureTable.id, validatedPayload.captureIds)
				)!!
			);
			return ctx.body(null, 204);
		}
	);
