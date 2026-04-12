import { fetcher } from "../utilities/fetcher";
import { z } from "zod";

export function jira(config: {
  email: string;
  apiToken: string;
  base: string;
}) {
  const { email, apiToken, base } = config;
  const { request } = fetcher(base, {
    Authorization: `Basic ${btoa(`${email}:${apiToken}`)}`,
  });
  const user = request("GET", () => "/rest/api/3/myself", z.object({}));
  const projects = request("GET", () => "/rest/api/3/project", z.object({}));
  const project = request(
    "GET",
    ({ projectKey }) => `/rest/api/3/project/${projectKey}`,
    z
      .object({
        projectKey: z.string(),
      })
      .describe("Retrieve metadata for a specific project"),
  );
  const searchIssues = request(
    "POST",
    () => "/rest/api/3/search",
    z
      .object({
        jql: z.string(),
        maxResults: z.number().default(20),
      })
      .describe("Search issues in a project with JQL"),
  );
  const issue = request(
    "GET",
    ({ issueKey }) => `/rest/api/3/issue/${issueKey}`,
    z.object({ issueKey: z.string() }).describe("Retrieve a specific issue"),
  );
  const issueComments = request(
    "GET",
    ({ issueKey }) => `/rest/api/3/issue/${issueKey}/comment`,
    z
      .object({ issueKey: z.string() })
      .describe("Retrieve comments on an issue"),
  );
  const issueChangelog = request(
    "GET",
    ({ issueKey }) => `/rest/api/3/issue/${issueKey}?expand=changelog`,
    z
      .object({ issueKey: z.string() })
      .describe("Retrieve issue changelog/history"),
  );
  const issueTypes = request(
    "GET",
    () => `/rest/api/3/issuetype`,
    z.object({}).describe("List all issue types in Jira"),
  );
  const workflows = request(
    "GET",
    () => `/rest/api/3/workflow`,
    z.object({}).describe("List all available workflows"),
  );
  const transitions = request(
    "GET",
    ({ issueKey }) => `/rest/api/3/issue/${issueKey}/transitions`,
    z
      .object({ issueKey: z.string() })
      .describe("List valid transitions for an issue"),
  );

  return {
    user,
    projects,
    project,
    searchIssues,
    issue,
    issueComments,
    issueChangelog,
    issueTypes,
    workflows,
    transitions,
  };
}
