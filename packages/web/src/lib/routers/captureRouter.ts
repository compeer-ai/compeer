import { Hono } from 'hono';
import * as v from 'valibot';
import { CaptureRepository, captureSchema } from '$lib/repository/captureRepository';
import { loggers } from '$lib/utilities/loggers';
import { rag } from '$lib/utilities/rag';
import { and, eq, inArray } from 'drizzle-orm';
import { captureChunkTable, captureTable } from '$lib/utilities/schema';
import { scrape } from '@compeer-ai/scrape';
import { db } from '$lib/utilities/sqlite';
import { rpc } from '$lib/utilities/rpc';

const captureRepository = new CaptureRepository();
const Type = {
	text: 'text',
	data: 'data',
	url: 'url'
} as const;

export const createCaptureRpc = await rpc.mutation(
	'/create_cpature',
	v.object({
		type: v.enum(Type),
		content: v.string(),
		storeId: v.string()
	}),
	async (args) => {
		const { type, storeId } = args;
		let { content } = args;
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
		return createdCapture;
	}
);

export const readCapturesRpc = await rpc.query(
	'/read_captures',
	v.object({
		storeId: v.string(),
		offset: v.optional(v.number()),
		limit: v.optional(v.number())
	}),
	async (args) => {
		const result = await captureRepository.readByPredicate(
			eq(captureTable.storeId, args.storeId),
			args.offset,
			args.limit
		);
		const captures = result.all();
		const formattedCaptures = captures.map(({ embedding, ...others }) => others);
		return formattedCaptures;
	}
);

export const createCapturesSchema = v.object({
	captures: v.array(captureSchema)
});

export const readSearchCapturesRpc = await rpc.query(
	'/read_search_captures',
	v.object({
		store: v.optional(v.string()),
		workspace: v.string(),
		query: v.string()
	}),
	async (args) => {
		const { query, store, workspace } = args;
		const context = store
			? await rag.projectContext(query, workspace, store)
			: await rag.mainContext(query, workspace);
		return context;
	}
);

export const updateCaptureEnabledRpc = await rpc.mutation(
	'/update_capture_enabled',
	v.object({
		id: v.string(),
		enabled: v.boolean(),
		storeId: v.string()
	}),
	async (args) => {
		await captureRepository.updateByPredicate(args.id, eq(captureTable.storeId, args.storeId), {
			enabled: args.enabled
		});
		return { success: true };
	},
	(args) => [...readCapturesRpc.invalidate(args)]
);

export const createCaptures = await rpc.mutation('create_capture', createCapturesSchema, async (args) => {
	const result = await captureRepository.createMany(args.captures);
	return result.first();
});

export const updateCaptureRpc = await rpc.mutation(
	'update_capture',
	v.object({
		id: v.string(),
		enabled: v.optional(v.boolean(), false),
		originalContent: v.string(),
		originalUrl: v.optional(v.string()),
		content: v.string(),
		storeId: v.string(),
		type: v.enum(Type)
	}),
	async (args) => {
		const { content, enabled, id, type } = args;
		let embedding: number[] | undefined;
		let url: string | undefined;
		let textToEmbed: string = content;
		let contentToStore: string = content;
		let chunkEmbeddings: { content: string; embedding: number[] }[] | undefined;
		let contentChanged = content !== args.originalContent;

		if (type === 'url') {
			url = content;
			const originalUrl = args.originalUrl;
			const urlChanged = originalUrl ? url !== originalUrl : contentChanged;
			contentChanged = urlChanged;
			if (urlChanged) {
				textToEmbed = await scrape.regex(fetch, url);
				contentToStore = textToEmbed;
			} else {
				contentToStore = args.originalContent;
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
		await captureRepository.updateByPredicate(id, eq(captureTable.storeId, args.storeId), payload);
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
		return { success: true };
	}
);

export const deleteCaptureRpc = await rpc.mutation(
	'delete_capture',
	v.object({
		id: v.string(),
		storeId: v.string()
	}),
	async (args) => {
		await captureRepository.deleteById(args.id);
		loggers.data.info('Deleted capture');
		return { success: true };
	}
);

export const deleteCapturesRpc = await rpc.mutation(
	'/delete_captures',
	v.object({
		captureIds: v.array(v.string()),
		storeId: v.string()
	}),
	async (args) => {
		await captureRepository.deleteByPredicate(
			and(eq(captureTable.storeId, args.storeId), inArray(captureTable.id, args.captureIds))!!
		);
		return { success: true };
	}
);

export const captureRouter = new Hono()
	.get('/read_search_captures', ...readCapturesRpc.handler)
	.get('/read_captures', ...readSearchCapturesRpc.handler)
	.get('/read_captures', ...readCapturesRpc.handler)
	.post('/create_capture', ...createCaptureRpc.handler)
	.post('/create_captures', ...createCaptures.handler)
	.put('/update_capture_enabled', ...updateCaptureEnabledRpc.handler)
	.put('/update_capture', ...updateCaptureRpc.handler)
	.delete('/delete_capture', ...deleteCaptureRpc.handler)
	.delete('/delete_captures', ...deleteCapturesRpc.handler);
