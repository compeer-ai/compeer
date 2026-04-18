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

const projectRepository = new ProjectRepository();

const _readProject = enhancedValidatedQuery(
	'read_project',
	v.object({
		id: v.string()
	}),
	async ({ validatedPayload }) => {
		const { url } = getRequestEvent();
		const result = await projectRepository.readByPredicate(
			eq(projectTable.id, validatedPayload.id)
		);
		const project = result.first();
		if (!project) {
			throw errors.notFound(url, 'Project not found');
		}
		return project;
	}
);

const _readProjects = enhancedValidatedQuery(
	'read_projects',
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
	async ({ validatedPayload }) => {
		const result = await projectRepository.deleteByPredicate(
			eq(projectTable.id, validatedPayload.id)
		);
		const project = result.first();
		loggers.data.child(project).info('Deleted project');

		await _readProject.refresh(project);
		_readProjects.refresh(project);
	}
);

export const formDeleteProject = _deleteProject.form;

const _updateProject = enhancedValidatedMutation(
	v.object({
		name: v.string(),
		id: v.string(),
		description: v.string()
	}),
	async ({ validatedPayload }) => {
		const result = await projectRepository.update(validatedPayload.id, validatedPayload);
		const updatedProject = await result.first();
		loggers.data.info('Updated project');

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
	async ({ validatedPayload }) => {
		const result = await projectRepository.create(validatedPayload);
		const createdProject = await result.first();
		loggers.data.info('Created Project');

		_readProjects.refresh(createdProject);
	}
);

export const formCreateProject = _createProject.form;

const _exportProject = enhancedValidatedMutation(
	v.object({
		id: v.string()
	}),
	async ({ validatedPayload }) => {
		const [project, captures] = await Promise.all([
			_readProject.query({ id: validatedPayload.id }),
			readCaptures({ projectId: validatedPayload.id })
		]);
		return {
			project,
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
	async ({ validatedPayload }) => {
		const { file } = validatedPayload;
		const text = await file.text();
		const json = JSON.parse(text);
		const schema = v.object({
			project: v.pipe(
				projectSchema,
				v.transform((value) => ({ ...value, workspaceId: validatedPayload.workspaceId }))
			),
			captures: v.array(captureSchema)
		});
		const data = await v.parseAsync(schema, json);
		await _createProject.command(data.project);
		if (data.captures.length) {
			await commandCreateCaptures({ captures: data.captures });
		}
	}
);

export const formImportProject = _importProject.form;
