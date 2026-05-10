import { command, positional, string } from "@drizzle-team/brocli";
import { config } from "../utilities/config";
import { mcpServer } from "../utilities/mcpServer";

export const mcpCommand = command({
    name: 'mcp',
    options: {
        workspace: positional('workspace').required(),
        store: positional('store')
    },
    transform: async (opts) => {
        const currentConfig = await config.read();
        return {...currentConfig, ...opts}
    },
    handler: (opts) => {
        mcpServer(opts, opts.workspace, opts.store)
    }
})