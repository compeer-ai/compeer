import { WorkspaceRepository } from '$lib/repository/workspaceRepository';
import {
	enhancedQuery,
	enhancedValidatedMutation,
	enhancedValidatedQuery
} from '$lib/utilities/remote';
import { workspaceTable } from '$lib/utilities/schema';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

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
			_readWorkspaces.refreshAll();
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
		_readWorkspaces.refreshAll();
	}
);

export const deleteWorkspace = _deleteWorkspace.form;

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
		await workspaceRepository.create({ name: validatedPayload.name });
		_readWorkspaces.refreshAll();
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
		_readWorkspaces.refreshAll();
		await _readWorkspace.refresh(updatedWorkspace);
	}
);

export const formUpdateWorkspace = _updateWorkspace.form;
