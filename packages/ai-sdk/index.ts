import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export function createCompeerProvider(args: { url: string, workspace: string, store?: string, apiKey?: string, bearer?: string, headers: Record<string, string> }) {
    const { url , workspace, store, apiKey, bearer, headers: inferenceHeaders } = args;
    let headers: Record<string, string> = inferenceHeaders
    if (apiKey) {
        headers['X-Api-Key'] = apiKey;
    } else if (bearer) {
        headers['Authorization'] = `Bearer ${bearer}`
    }
    const baseURL = store ? new URL(`/${workspace}/${store}/inference`, url) : new URL(`/${workspace}/inference`, url)
    return createOpenAICompatible({
        baseURL: baseURL.toString(),
        name: "compeer",
        headers
    })
}