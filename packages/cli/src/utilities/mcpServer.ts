import { McpServer } from "tmcp";
import * as pkg from "../../package.json";
import { ValibotJsonSchemaAdapter } from "@tmcp/adapter-valibot";
import { backend } from "./backend";
import type { Config } from "../models/config";
import * as v from "valibot";
import { StdioTransport } from "@tmcp/transport-stdio";

export function mcpServer(config: Config, workspace: string, store?: string) {
  const mcpServer = new McpServer(
    {
      name: store ? `${workspace}-${store}-server` : `${workspace}-server`,
      version: pkg.version,

    },
    {
      adapter: new ValibotJsonSchemaAdapter(),
      capabilities: {
        tools: {},
      },
      instructions: `Use this server for finding context within ${workspace}${store ? `/${store}` : ''}`
    },
  );

  mcpServer.tool(
    {
      name: "search",
      description: "Search for context that might be useful",
      schema: v.object({
        query: v.string(),
      }),
      outputSchema: v.object({
        result: v.array(
          v.object({
            content: v.string(),
          }),
        ),
      }),
    },
    async ({ query }) => {
      const client = backend.client(config.server, config.jwt);
      const result = await client[":workspace"].search.$get({
        param: {
          workspace,
        },
        query: { query, store },
      });
      if (result.ok) {
        const json = await result.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(json),
            },
          ],
          structuredContent: {
            result: json,
          },
        };
      }
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Unable to perform search",
          },
        ],
      };
    },
  );

  const stdio = new StdioTransport(mcpServer);
  stdio.listen();
}
