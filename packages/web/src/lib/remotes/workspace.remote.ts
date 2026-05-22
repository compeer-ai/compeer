import { WorkspaceRepository, workspaceSchema } from '$lib/repository/workspaceRepository';
import { enhancedValidatedMutation, enhancedValidatedQuery } from '$lib/utilities/remote';
import { workspaceTable } from '$lib/utilities/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { commandCreateStoresWithCaptures, commandExportStore, readStores } from './store.remote';
import { selectStoreSchema } from '$lib/repository/storeRepository';
import { captureSchema } from '$lib/repository/captureRepository';

const workspaceRepository = new WorkspaceRepository();

const _readWorkspace = enhancedValidatedQuery(
	'read_workspace',
	null,
	v.object({
		name: v.string()
	}),
	async ({ validatedPayload }) => {
		const result = await workspaceRepository.readByPredicate(
			eq(workspaceTable.name, validatedPayload.name)
		);
		const workspace = result.first();
		if (!workspace) {
			const createdWorkspace = await workspaceRepository.create({ name: validatedPayload.name });
			await _readWorkspaces.refresh({ limit: undefined, offset: undefined });
			return createdWorkspace.first();
		}
		return workspace;
	}
);

export const readWorkspace = _readWorkspace.query;

const _deleteWorkspace = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	'deleteWorkspaces',
	async ({ validatedPayload }) => {
		await workspaceRepository.deleteById(validatedPayload.id);
		await _readWorkspaces.refresh({ limit: undefined, offset: undefined });
	}
);

export const deleteWorkspace = _deleteWorkspace.form;

const _exportWorkspace = enhancedValidatedMutation(
	v.object({
		name: v.string()
	}),
	'exportWorkspaces',
	async ({ validatedPayload }) => {
		const workspace = await _readWorkspace.query({ name: validatedPayload.name });
		const stores = await readStores({
			workspaceId: workspace.id,
			limit: undefined,
			offset: undefined
		});
		const storeExports = await Promise.all(
			stores.map((store) => commandExportStore({ id: store.id }))
		);
		return {
			workspace,
			stores: storeExports
		};
	}
);

export const exportWorkspaceCommand = _exportWorkspace.command;

const _importWorkspace = enhancedValidatedMutation(
	v.object({
		file: v.blob()
	}),
	'importWorkspaces',
	async ({ validatedPayload }) => {
		const { file } = validatedPayload;
		const text = await file.text();
		const json = JSON.parse(text);
		const schema = v.object({
			workspace: workspaceSchema,
			stores: v.array(
				v.object({
					store: selectStoreSchema,
					captures: v.array(captureSchema)
				})
			)
		});
		const data = await v.parseAsync(schema, json);
		await _createWorkspace.command({ name: data.workspace.name })
		await commandCreateStoresWithCaptures({ ...data, workspaceId: data.workspace.id });

		_readWorkspaces.refresh({ limit: undefined, offset: undefined })
	}
);

export const formImportWorkspace = _importWorkspace.form;

const _readWorkspaces = enhancedValidatedQuery(
	'read_workspaces',
	null,
	v.object({
		limit: v.optional(v.number()),
		offset: v.optional(v.number())
	}),
	async ({ validatedPayload }) => {
		const workspaces = await workspaceRepository.readAll(
			validatedPayload.limit,
			validatedPayload.offset
		);
		return workspaces;
	}
);

export const readWorkspaces = _readWorkspaces.query;

const _createWorkspace = enhancedValidatedMutation(
	v.object({
		name: v.pipe(
			v.string(),
			v.transform((input) => input.toLocaleLowerCase().replaceAll(' ', '-'))
		)
	}),
	'createWorkspaces',
	async ({ validatedPayload }) => {
		const result = await workspaceRepository.create({ name: validatedPayload.name });
		const createdWorkspace = result.first();
		await _readWorkspaces.refresh({ ...createdWorkspace, limit: undefined, offset: undefined });
	}
);

export const formCreateWorkspace = _createWorkspace.form;

const _updateWorkspace = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		name: v.string()
	}),
	'updateWorkspaces',
	async ({ validatedPayload }) => {
		const result = await workspaceRepository.update(validatedPayload.id, validatedPayload);
		const updatedWorkspace = result.first();
		await _readWorkspaces.refresh({ ...updatedWorkspace, limit: undefined, offset: undefined });
		await _readWorkspace.refresh(updatedWorkspace);
	}
);

export const formUpdateWorkspace = _updateWorkspace.form;
