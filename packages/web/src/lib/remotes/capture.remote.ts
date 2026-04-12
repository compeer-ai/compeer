import { CaptureRepository, captureSchema, type Capture } from '$lib/repository/captureRepository';
import { loggers } from '$lib/utilities/loggers';
import { rag } from '$lib/utilities/rag';
import * as v from 'valibot';
import { enhancedValidatedQuery, enhancedValidatedMutation } from '../utilities/remote';
import { and, eq, inArray } from 'drizzle-orm';
import { captureChunkTable, captureTable } from '$lib/utilities/schema';
import { getRequestEvent, query } from '$app/server';
import { scrape } from '@barque/scrape';
import { db } from '$lib/utilities/sqlite';

const captureRepository = new CaptureRepository();
const Type = {
	text: 'text',
	data: 'data',
	url: 'url'
} as const;

export const readSearchCaptures = query(
	v.object({
		project: v.string(),
		workspace: v.string(),
		query: v.string()
	}),
	async (validatedPayload) => {
		const { query, project, workspace } = validatedPayload;
		const context = project
			? await rag.projectContext(query, workspace, project)
			: await rag.mainContext(query, workspace);
		return context;
	}
);

const _readCaptures = enhancedValidatedQuery(
	'read_captures',
	v.object({
		projectId: v.string()
	}),
	async ({ validatedPayload }) => {
		const result = await captureRepository.readByPredicate(
			and(eq(captureTable.projectId, validatedPayload.projectId), eq(captureTable.deleted, false))!!
		);
		const captures = result.all();
		const formattedCaptures = captures.map(({ embedding, ...others }) => others);
		return formattedCaptures;
	}
);

export const readCaptures = _readCaptures.query;

const _createCapture = enhancedValidatedMutation(
	v.object({
		type: v.enum(Type),
		content: v.string(),
		projectId: v.string()
	}),
	async ({ validatedPayload }) => {
		const { fetch } = getRequestEvent();
		const { type, projectId } = validatedPayload;
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
			projectId
		};
		const createdCapture = await captureRepository.create(payload);
		const created = createdCapture.first();
		if (created && chunkEmbeddings.length > 0) {
			await db.insert(captureChunkTable).values(
				chunkEmbeddings.map((chunk) => ({
					captureId: created.id,
					content: chunk.content,
					embedding: chunk.embedding
				}))
			);
		}
		loggers.data.info('Created capture');

		await _readCaptures.refresh({ projectId });
	}
);

export const formCreateCapture = _createCapture.form;
export const commandCreateCapture = _createCapture.command;

const _createCaptures = enhancedValidatedMutation(
	v.object({
		captures: v.array(captureSchema)
	}),
	async ({ validatedPayload }) => {
		const result = await captureRepository.createMany(validatedPayload.captures as Capture[]);
		const createdCapture = result.first();
		const projectId = createdCapture?.projectId ?? validatedPayload.captures[0]?.projectId;

		if (projectId) {
			await _readCaptures.refresh({ projectId });
		}
	}
);

export const commandCreateCaptures = _createCaptures.command;

const _updateCaptureEnabled = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		enabled: v.boolean(),
		projectId: v.string()
	}),
	async ({ validatedPayload }) => {
		await captureRepository.updateByPredicate(
			validatedPayload.id,
			eq(captureTable.projectId, validatedPayload.projectId),
			{
				enabled: validatedPayload.enabled
			}
		);

		await _readCaptures.refresh(validatedPayload);
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
		projectId: v.string(),
		type: v.enum(Type)
	}),
	async ({ validatedPayload }) => {
		console.log(validatedPayload);
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
			eq(captureTable.projectId, validatedPayload.projectId),
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

		await _readCaptures.refresh(validatedPayload);
	}
);

export const formUpdateCapture = _updateCapture.form;

const _deleteCapture = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		projectId: v.string()
	}),
	async ({ validatedPayload }) => {
		await captureRepository.updateByPredicate(
			validatedPayload.id,
			eq(captureTable.projectId, validatedPayload.projectId),
			{
				deleted: true
			}
		);
		loggers.data.info('Deleted capture');

		await _readCaptures.refresh(validatedPayload);
	}
);

export const commandDeleteCapture = _deleteCapture.command;

const _deleteCaptures = enhancedValidatedMutation(
	v.object({
		captureIds: v.array(v.string()),
		projectId: v.string()
	}),
	async ({ validatedPayload }) => {
		await captureRepository.deleteByPredicate(
			and(
				eq(captureTable.projectId, validatedPayload.projectId),
				inArray(captureTable.id, validatedPayload.captureIds)
			)!!
		);

		await _readCaptures.refresh(validatedPayload);
	}
);

export const commandDeleteCaptures = _deleteCaptures.command;
