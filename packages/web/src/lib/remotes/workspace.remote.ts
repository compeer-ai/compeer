import { WorkspaceRepository } from '$lib/repository/workspaceRepository';
import { config } from '$lib/utilities/config';
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
	true,
	v.object({
		name: v.pipe(
			v.string(),
			v.transform((value) => value.toLowerCase())
		)
	}),
	async ({ validatedPayload }) => {
		const result = await workspaceRepository.readByPredicate(
			eq(workspaceTable.name, validatedPayload.name)
		);
		const workspace = result.first();
		if (!workspace) {
			const createdWorkspace = await workspaceRepository.create({ name: validatedPayload.name });
			await _readWorkspaces.refresh();
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
	config.flags.deleteWorkspaces,
	async ({ validatedPayload }) => {
		await workspaceRepository.deleteById(validatedPayload.id);
		await _readWorkspaces.refresh();
	}
);

export const deleteWorkspace = _deleteWorkspace.form;

const _readWorkspaces = enhancedQuery('read_workspaces', true, async () => {
	const workspaces = await workspaceRepository.readAll();
	return workspaces;
});

export const readWorkspaces = _readWorkspaces.query;

const _createWorkspace = enhancedValidatedMutation(
	v.object({
		name: v.string()
	}),
	config.flags.createWorkspaces,
	async ({ validatedPayload }) => {
		await workspaceRepository.create({ name: validatedPayload.name });
		await _readWorkspaces.refresh();
	}
);

export const formCreateWorkspace = _createWorkspace.form;

const _updateWorkspace = enhancedValidatedMutation(
	v.object({
		id: v.string(),
		name: v.string()
	}),
	config.flags.updateWorkspaces,
	async ({ validatedPayload }) => {
		const result = await workspaceRepository.update(validatedPayload.id, validatedPayload);
		const updatedWorkspace = result.first();

		await _readWorkspaces.refresh();
		await _readWorkspace.refresh(updatedWorkspace);
	}
);

export const formUpdateWorkspace = _updateWorkspace.form;
