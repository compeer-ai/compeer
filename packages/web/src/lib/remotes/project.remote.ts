import { errors } from '$lib/utilities/errors';
import { loggers } from '$lib/utilities/loggers';
import { ProjectRepository, projectSchema } from '$lib/repository/projectRepository';
import { getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { projectTable } from '$lib/utilities/schema';
import * as v from 'valibot';
import { enhancedValidatedMutation, enhancedValidatedQuery } from '../utilities/remote';
import { captureSchema } from '$lib/repository/captureRepository';
import { commandCreateCaptures, readCaptures } from './capture.remote';
import { config } from '$lib/utilities/config';

const projectRepository = new ProjectRepository();

const _readProject = enhancedValidatedQuery(
	'read_project',
	true,
	v.object({
		id: v.string()
	}),
	async ({ validatedPayload }) => {
		const { url } = getRequestEvent();
		const result = await projectRepository.readByPredicate(
			eq(projectTable.id, validatedPayload.id)
		);
		const store = result.first();
		if (!store) {
			throw errors.notFound(url, 'Store not found');
		}
		return store;
	}
);

const _readProjects = enhancedValidatedQuery(
	'read_projects',
	true,
	v.object({
		workspaceId: v.string()
	}),
	async ({ validatedPayload }) => {
		const result = await projectRepository.readByPredicate(
			eq(projectTable.workspaceId, validatedPayload.workspaceId)
		);
		const projects = result.all();
		return projects;
	}
);

export const readProject = _readProject.query;
export const readProjects = _readProjects.query;

const _deleteProject = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	config.flags.deleteProjects,
	async ({ validatedPayload }) => {
		const result = await projectRepository.deleteByPredicate(
			eq(projectTable.id, validatedPayload.id)
		);
		const store = result.first();
		console.log(store);
		loggers.data.child(store).info('Deleted store');

		await _readProject.refresh(store);
		_readProjects.refresh(store);
	}
);

export const formDeleteProject = _deleteProject.form;

const _updateProject = enhancedValidatedMutation(
	v.object({
		name: v.string(),
		id: v.string(),
		description: v.string()
	}),
	config.flags.updateProjects,
	async ({ validatedPayload }) => {
		const result = await projectRepository.update(validatedPayload.id, validatedPayload);
		const updatedProject = await result.first();
		loggers.data.info('Updated store');

		await _readProject.refresh({ id: validatedPayload.id });
		await _readProjects.refresh(updatedProject);
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
		const result = await projectRepository.create(validatedPayload);
		const createdProject = await result.first();
		loggers.data.info('Created Store');

		_readProjects.refresh(createdProject);
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
			_readProject.query({ id: validatedPayload.id }),
			readCaptures({ projectId: validatedPayload.id })
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
