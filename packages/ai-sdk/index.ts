import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { Compeer} from '@compeer-ai/sdk';
import { tool } from 'ai';
import * as v from 'valibot';
import { valibotSchema } from '@ai-sdk/valibot';

export function createCompeerProvider(args: { compeer: Compeer, workspace: string, store?: string, headers: Record<string, string> }) {
  const { compeer, workspace, store, headers: inferenceHeaders } = args;
  const { apiKey, bearerToken } = compeer;
    let headers: Record<string, string> = inferenceHeaders
    if (apiKey) {
        headers['X-Api-Key'] = apiKey;
    } else if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`
    }
    const baseURL = store ? new URL(`/${workspace}/${store}/completions`, compeer.baseURL) : new URL(`/${workspace}/completions`, compeer.baseURL)
    return createOpenAICompatible({
        baseURL: baseURL.toString(),
        name: "compeer",
        headers
    })
}

export function createTools(compeer: Compeer) {
  const Type = {
  	Text: 'text',
  	Data: 'data',
  	Url: 'url'
  } as const;

  return {
    searchCaptures: tool({
      description: 'Search captures within compeer',
      inputSchema: valibotSchema(v.object({
        workspace: v.pipe(v.string(), v.description('The workspace to search in')),
        query: v.pipe(v.string(), v.description('The search query to find captures')),
        store: v.pipe(v.optional(v.string()), v.description('The store to search within (optional)'))
      })),
      execute: ({ query, store, workspace }) => {
        return compeer.search.query(workspace, { query, store })
      }
    }),
    listWorkspaces: tool({
      description: 'Get all workspaces',
      inputSchema: valibotSchema(v.object({

      })),
      execute: () => {
        return compeer.workspaces.list()
      }
    }),
    listStores: tool({
      description: 'Get all stores within a workspace',
      inputSchema: valibotSchema(v.object({
          workspace: v.pipe(v.string(), v.description('The workspace to list stores from'))
      })),
      execute: ({ workspace }) => {
        return compeer.stores.list(workspace)
      }
    }),
    createCapture: tool({
      description: 'Create a capture',
      inputSchema: valibotSchema(v.object({
        workspace: v.pipe(v.string(), v.description('The workspace to create the capture in')),
        store: v.pipe(v.string(), v.description('The store to create the capture in')),
        content: v.pipe(v.string(), v.description('The content of the capture')),
        type: v.pipe(v.enum(Type), v.description('The type of capture (text, data, or url)'))
      })),
      execute: ({ workspace, store, content, type }) => {
        return compeer.capture.create(workspace, { store, content, type })
      }
    })
  }
}
