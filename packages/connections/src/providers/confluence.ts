import { fetcher } from "../utilities/fetcher";
import { z } from "zod";

export function confluence(config: {
  email: string;
  apiToken: string;
  base: string;
}) {
  const { email, apiToken, base } = config;
  const { request } = fetcher(base, {
    Authorization: `Basic ${btoa(`${email}:${apiToken}`)}`,
  });
  const user = request("GET", () => "/rest/api/user/current", z.object({}));
  const spaces = request("GET", () => "/rest/api/space?limit=50", z.object({}));
  const space = request(
    "GET",
    ({ spaceKey }) => `/rest/api/space/${spaceKey}`,
    z
      .object({ spaceKey: z.string() })
      .describe("Retrieve metadata for a specific space"),
  );
  const pagesInSpace = request(
    "GET",
    ({ spaceKey }) =>
      `/rest/api/content?spaceKey=${spaceKey}&type=page&limit=50`,
    z.object({ spaceKey: z.string() }).describe("List pages in a space"),
  );
  const page = request(
    "GET",
    ({ pageId }) => `/rest/api/content/${pageId}?expand=body.storage,version`,
    z.object({ pageId: z.string() }).describe("Retrieve a specific page"),
  );
  const childPages = request(
    "GET",
    ({ pageId }) => `/rest/api/content/${pageId}/child/page`,
    z.object({ pageId: z.string() }).describe("Get child pages of a page"),
  );
  const pageComments = request(
    "GET",
    ({ pageId }) => `/rest/api/content/${pageId}/child/comment`,
    z.object({ pageId: z.string() }).describe("Retrieve comments on a page"),
  );
  const attachments = request(
    "GET",
    ({ pageId }) => `/rest/api/content/${pageId}/child/attachment`,
    z.object({ pageId: z.string() }).describe("Get attachments for a page"),
  );
  const searchPages = request(
    "GET",
    ({ cql, limit = 20 }) =>
      `/rest/api/content/search?cql=${encodeURIComponent(cql)}&limit=${limit}`,
    z
      .object({ cql: z.string(), limit: z.number().optional() })
      .describe("Search documentation with Confluence Query Language (CQL)"),
  );
  const pageHistory = request(
    "GET",
    ({ pageId }) => `/rest/api/content/${pageId}/version`,
    z.object({ pageId: z.string() }).describe("Retrieve page history"),
  );

  return {
    user,
    spaces,
    space,
    pagesInSpace,
    page,
    childPages,
    pageComments,
    attachments,
    searchPages,
    pageHistory,
  };
}
