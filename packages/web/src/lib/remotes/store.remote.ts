import { errors } from '$lib/utilities/errors';
import { loggers } from '$lib/utilities/loggers';
import { StoreRepository, projectSchema } from '$lib/repository/storeRepository';
import { getRequestEvent } from '$app/server';
import { and, eq } from 'drizzle-orm';
import { storeTable } from '$lib/utilities/schema';
import * as v from 'valibot';
import { enhancedValidatedMutation, enhancedValidatedQuery } from '../utilities/remote';
import { captureSchema } from '$lib/repository/captureRepository';
import { commandCreateCaptures, readCaptures } from './capture.remote';

const storeRepository = new StoreRepository();

const _readStore = enhancedValidatedQuery(
	'read_store',
	null,
	v.object({
		id: v.string()
	}),
	async ({ validatedPayload }) => {
		const { url } = getRequestEvent();
		const result = await storeRepository.readByPredicate(eq(storeTable.id, validatedPayload.id));
		const store = result.first();
		if (!store) {
			throw errors.notFound(url, 'Store not found');
		}
		return store;
	}
);

export const readStore = _readStore.query;

const _readStores = enhancedValidatedQuery(
	'read_stores',
	null,
	v.object({
		workspaceId: v.string(),
		limit: v.optional(v.number()),
		offset: v.optional(v.number())
	}),
	async ({ validatedPayload }) => {
		const result = await storeRepository.readByPredicate(
			eq(storeTable.workspaceId, validatedPayload.workspaceId),
			validatedPayload.offset,
			validatedPayload.limit
		);
		const stores = result.all();
		return stores;
	}
);

export const readStores = _readStores.query;

const _readStoreByNameAndWorkspaceId = enhancedValidatedQuery(
	'read_store_by_name_and_workspace_id',
	null,
	v.object({
		name: v.string(),
		workspaceId: v.string()
	}),
	async ({ validatedPayload }) => {
		const { url } = getRequestEvent();
		const result = await storeRepository.readByPredicate(
			and(
				eq(storeTable.name, validatedPayload.name),
				eq(storeTable.workspaceId, validatedPayload.workspaceId)
			)!!
		);
		const store = result.first();
		if (!store) {
			throw errors.notFound(url, 'Store not found');
		}
		return store;
	}
);

export const readStoreByNameAndWorkspaceId = _readStoreByNameAndWorkspaceId.query;

const _deleteStore = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	'deleteProjects',
	async ({ validatedPayload }) => {
		const result = await storeRepository.deleteByPredicate(eq(storeTable.id, validatedPayload.id));
		const store = result.first();
		loggers.data.child(store).info('Deleted store');

		await _readStore.refresh(store);
		await _readStoreByNameAndWorkspaceId.refresh(store);
		await _readStores.refresh(store);
	}
);

export const formDeleteStore = _deleteStore.form;
export const commandDeleteStore = _deleteStore.command;

const _updateStore = enhancedValidatedMutation(
	v.object({
		name: v.string(),
		id: v.string(),
		description: v.string()
	}),
	'updateProjects',
	async ({ validatedPayload }) => {
		const result = await storeRepository.update(validatedPayload.id, validatedPayload);
		const updatedStore = await result.first();
		loggers.data.info('Updated store');

		await _readStore.refresh({ id: validatedPayload.id });
		await _readStore.refresh(validatedPayload);
		await _readStores.refresh(updatedStore);
	}
);

export const formUpdateStore = _updateStore.form;

const _createStore = enhancedValidatedMutation(
	v.object({
		name: v.pipe(
			v.string(),
			v.transform((input) => input.toLowerCase().replaceAll(' ', '-'))
		),
		description: v.nullish(v.string()),
		workspaceId: v.string()
	}),
	'createProjects',
	async ({ validatedPayload }) => {
		const result = await storeRepository.create(validatedPayload);
		const createdStore = await result.first();
		loggers.data.info('Created Store');

		await _readStores.refresh(createdStore);
	}
);

export const formCreateStore = _createStore.form;

const _exportStore = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	'exportProjects',
	async ({ validatedPayload }) => {
		const [store, captures] = await Promise.all([
			_readStore.query({ id: validatedPayload.id }),
			readCaptures({ storeId: validatedPayload.id })
		]);
		return {
			store,
			captures: captures
		};
	}
);

export const commandExportStore = _exportStore.command;

const _importStore = enhancedValidatedMutation(
	v.object({
		file: v.blob(),
		workspaceId: v.string()
	}),
	'importProjects',
	async ({ validatedPayload }) => {
		const { file } = validatedPayload;
		const text = await file.text();
		const json = JSON.parse(text);
		const schema = v.object({
			store: v.pipe(
				projectSchema,
				v.transform((value) => ({ ...value, workspaceId: validatedPayload.workspaceId }))
			),
			captures: v.array(captureSchema)
		});
		const data = await v.parseAsync(schema, json);
		await _createStore.command(data.store);
		if (data.captures.length) {
			await commandCreateCaptures({ captures: data.captures });
		}
	}
);

export const formImportStore = _importStore.form;
