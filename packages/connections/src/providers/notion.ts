import { fetcher } from "../utilities/fetcher";
import { z } from "zod";

export function notion(config: { token: string; version: string }) {
  const { request } = fetcher(`https://api.notion.com/v1`, config);
  const listUsers = request(
    "GET",
    () => "/users/me",
    z.any().describe("Get the authenticated Notion user"),
  );
  const search = request(
    "POST",
    () => "/search",
    z
      .object({
        query: z.string(),
        page_size: z.number().default(100),
      })
      .describe("Search for pages, databases, or other objects in Notion"),
  );
  const searchDatabases = request(
    "POST",
    () => "/search",
    z
      .object({
        page_size: z.number().default(100),
        filter: {
          value: z.literal("database"),
          property: z.literal("object"),
        },
      })
      .describe("Search for all databases in the workspace"),
  );
  const database = request(
    "GET",
    ({ databaseId }) => `/databases/${databaseId}`,
    z
      .object({
        databaseId: z.string(),
      })
      .describe("Retrieve metadata for a specific database"),
  );
  const queryDatabase = request(
    "POST",
    ({ databaseId }) => `/databases/${databaseId}/query`,
    z
      .object({
        page_size: z.number().default(20),
        filter: z.object().optional(),
        databaseId: z.string(),
      })
      .describe("Query a database with optional filters and pagination"),
  );
  const page = request(
    "GET",
    ({ pageId }) => `/pages/${pageId}`,
    z
      .object({
        pageId: z.string(),
      })
      .describe("Retrieve a specific page by its ID"),
  );
  const blockChildren = request(
    "GET",
    ({ page_size, block_id }) =>
      `/blocks/${block_id}/children?page_size=${page_size}`,
    z
      .object({
        block_id: z.string(),
        page_size: z.number().default(100),
      })
      .describe("Retrieve child blocks of a given block with pagination"),
  );
  const comments = request(
    "GET",
    ({ block_id }) => `/comments?block_id=${block_id}`,
    z
      .object({
        block_id: z.string(),
      })
      .describe("Get comments attached to a specific block"),
  );
  const block = request(
    "GET",
    ({ block_id }) => `/blocks/${block_id}`,
    z
      .object({
        block_id: z.string(),
      })
      .describe("Retrieve a specific block by its ID"),
  );

  return {
    listUsers,
    searchDatabases,
    search,
    database,
    comments,
    queryDatabase,
    blockChildren,
    page,
    block,
  };
}
