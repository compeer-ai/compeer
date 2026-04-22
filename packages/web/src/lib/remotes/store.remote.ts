import { errors } from '$lib/utilities/errors';
import { loggers } from '$lib/utilities/loggers';
import { StoreRepository, projectSchema } from '$lib/repository/storeRepository';
import { getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { storeTable } from '$lib/utilities/schema';
import * as v from 'valibot';
import { enhancedValidatedMutation, enhancedValidatedQuery } from '../utilities/remote';
import { captureSchema } from '$lib/repository/captureRepository';
import { commandCreateCaptures, readCaptures } from './capture.remote';
import { config } from '$lib/utilities/config';

const storeRepository = new StoreRepository();

const _readStore = enhancedValidatedQuery(
	'read_store',
	true,
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

const _readStores = enhancedValidatedQuery(
	'read_stores',
	true,
	v.object({
		workspaceId: v.string()
	}),
	async ({ validatedPayload }) => {
		const result = await storeRepository.readByPredicate(
			eq(storeTable.workspaceId, validatedPayload.workspaceId)
		);
		const stores = result.all();
		return stores;
	}
);

export const readStore = _readStore.query;
export const readStores = _readStores.query;

const _deleteStore = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	config.flags.deleteProjects,
	async ({ validatedPayload }) => {
		const result = await storeRepository.deleteByPredicate(eq(storeTable.id, validatedPayload.id));
		const store = result.first();
		console.log(store);
		loggers.data.child(store).info('Deleted store');

		await _readStore.refresh(store);
		_readStores.refresh(store);
	}
);

export const formDeleteProject = _deleteStore.form;

const _updateProject = enhancedValidatedMutation(
	v.object({
		name: v.string(),
		id: v.string(),
		description: v.string()
	}),
	config.flags.updateProjects,
	async ({ validatedPayload }) => {
		const result = await storeRepository.update(validatedPayload.id, validatedPayload);
		const updatedStore = await result.first();
		loggers.data.info('Updated store');

		await _readStore.refresh({ id: validatedPayload.id });
		await _readStores.refresh(updatedStore);
	}
);

export const formUpdateProject = _updateProject.form;

const _createProject = enhancedValidatedMutation(
	v.object({
		name: v.string(),
		description: v.nullish(v.string()),
		workspaceId: v.string()
	}),
	config.flags.createProjects,
	async ({ validatedPayload }) => {
		const result = await storeRepository.create(validatedPayload);
		const createdStore = await result.first();
		loggers.data.info('Created Store');

		_readStores.refresh(createdStore);
	}
);

export const formCreateProject = _createProject.form;

const _exportProject = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	config.flags.exportProjects,
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

export const commandExportProject = _exportProject.command;

const _importProject = enhancedValidatedMutation(
	v.object({
		file: v.blob(),
		workspaceId: v.string()
	}),
	config.flags.importProjects,
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
		await _createProject.command(data.store);
		if (data.captures.length) {
			await commandCreateCaptures({ captures: data.captures });
		}
	}
);

export const formImportProject = _importProject.form;
