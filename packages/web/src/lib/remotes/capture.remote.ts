import { CaptureRepository, captureSchema, type Capture } from '$lib/repository/captureRepository';
import { loggers } from '$lib/utilities/loggers';
import { rag } from '$lib/utilities/rag';
import * as v from 'valibot';
import { enhancedValidatedQuery, enhancedValidatedMutation } from '../utilities/remote';
import { and, eq, inArray } from 'drizzle-orm';
import { captureChunkTable, captureTable } from '$lib/utilities/schema';
import { getRequestEvent, query } from '$app/server';
import { scrape } from '@compeer-ai/scrape';
import { db } from '$lib/utilities/sqlite';

const captureRepository = new CaptureRepository();
const Type = {
	text: 'text',
	data: 'data',
	url: 'url'
} as const;

export const readSearchCaptures = query(
	v.object({
		store: v.optional(v.string()),
		workspace: v.string(),
		query: v.string()
	}),
	async (validatedPayload) => {
		const { query, store, workspace } = validatedPayload;
		const context = store
			? await rag.projectContext(query, workspace, store)
			: await rag.mainContext(query, workspace);
		return context;
	}
);

const _readCaptures = enhancedValidatedQuery(
	'read_captures',
	null,
	v.object({
		storeId: v.string(),
		offset: v.optional(v.number()),
		limit: v.optional(v.number())
	}),
	async ({ validatedPayload }) => {
		const result = await captureRepository.readByPredicate(
			eq(captureTable.storeId, validatedPayload.storeId),
			validatedPayload.limit,
			validatedPayload.offset,
			// Performance Optimization: Exclude the large 'embedding' blob (F32_BLOB, 384 dimensions)
			// to reduce database I/O, network transfer, and memory usage during list operations.
			{
				id: captureTable.id,
				created: captureTable.created,
				content: captureTable.content,
				type: captureTable.type,
				url: captureTable.url,
				enabled: captureTable.enabled,
				storeId: captureTable.storeId
			}
		);
		const captures = result.all();
		return captures;
	}
);

export const readCaptures = _readCaptures.query;

const _createCapture = enhancedValidatedMutation(
	v.object({
		type: v.enum(Type),
		content: v.string(),
		storeId: v.string()
	}),
	null,
	async ({ validatedPayload }) => {
		const { fetch } = getRequestEvent();
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

		await _readCaptures.refresh({ storeId, offset: undefined, limit: undefined });
	}
);

export const formCreateCapture = _createCapture.form;
export const commandCreateCapture = _createCapture.command;

const _createCaptures = enhancedValidatedMutation(
	v.object({
		captures: v.array(captureSchema)
	}),
	null,
	async ({ validatedPayload }) => {
		const result = await captureRepository.createMany(validatedPayload.captures as Capture[]);
		const createdCapture = result.first();
		await _readCaptures.refresh({ ...createdCapture, offset: undefined, limit: undefined });
	}
);

export const commandCreateCaptures = _createCaptures.command;

const _updateCaptureEnabled = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		enabled: v.boolean(),
		storeId: v.string()
	}),
	null,
	async ({ validatedPayload }) => {
		await captureRepository.updateByPredicate(
			validatedPayload.id,
			eq(captureTable.storeId, validatedPayload.storeId),
			{
				enabled: validatedPayload.enabled
			}
		);

		await _readCaptures.refresh({ ...validatedPayload, offset: undefined, limit: undefined });
	}
);
export const commandUpdateCaptureEnabled = _updateCaptureEnabled.command;

const _updateCapture = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		enabled: v.optional(v.boolean(), false),
		originalContent: v.string(),
		originalUrl: v.optional(v.string()),
		content: v.string(),
		storeId: v.string(),
		type: v.enum(Type)
	}),
	null,
	async ({ validatedPayload }) => {
		const { fetch } = getRequestEvent();
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

		await _readCaptures.refresh({ ...validatedPayload, offset: undefined, limit: undefined });
	}
);

export const formUpdateCapture = _updateCapture.form;

const _deleteCapture = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		storeId: v.string()
	}),
	null,
	async ({ validatedPayload }) => {
		const result = await captureRepository.deleteById(validatedPayload.id);
		const createdCapture = result.first()
		loggers.data.info('Deleted capture');

		await _readCaptures.refresh({ ...createdCapture, offset: undefined, limit: undefined });
	}
);

export const commandDeleteCapture = _deleteCapture.command;

const _deleteCaptures = enhancedValidatedMutation(
	v.object({
		captureIds: v.array(v.string()),
		storeId: v.string()
	}),
	null,
	async ({ validatedPayload }) => {
		const result = await captureRepository.deleteByPredicate(
			and(
				eq(captureTable.storeId, validatedPayload.storeId),
				inArray(captureTable.id, validatedPayload.captureIds)
			)!!
		);
		const deletedCapture = result.first();

		await _readCaptures.refresh({ ...deletedCapture, offset: undefined, limit: undefined });
	}
);

export const commandDeleteCaptures = _deleteCaptures.command;
