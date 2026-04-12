import { fetcher } from "../utilities/fetcher";
import { z } from "zod";

export function bitbucket(config: {
  user: string;
  appPassword: string;
  base: string;
}) {
  const { user, appPassword, base } = config;
  const { request } = fetcher(base, {
    Authorization: `Basic ${btoa(`${user}:${appPassword}`)}`,
  });
  const userInfo = request("GET", () => "/2.0/user", z.object({}));
  const workspaces = request("GET", () => "/2.0/workspaces", z.object({}));
  const repositories = request(
    "GET",
    ({ workspace }) => `/2.0/repositories/${workspace}`,
    z
      .object({ workspace: z.string() })
      .describe("List all repositories in a workspace"),
  );
  const repository = request(
    "GET",
    ({ workspace, repoSlug }) => `/2.0/repositories/${workspace}/${repoSlug}`,
    z
      .object({ workspace: z.string(), repoSlug: z.string() })
      .describe("Retrieve metadata for a specific repository"),
  );
  const branches = request(
    "GET",
    ({ workspace, repoSlug }) =>
      `/2.0/repositories/${workspace}/${repoSlug}/refs/branches`,
    z
      .object({ workspace: z.string(), repoSlug: z.string() })
      .describe("List all branches in a repository"),
  );
  const commits = request(
    "GET",
    ({ workspace, repoSlug }) =>
      `/2.0/repositories/${workspace}/${repoSlug}/commits`,
    z
      .object({ workspace: z.string(), repoSlug: z.string() })
      .describe("List all commits in a repository"),
  );
  const commit = request(
    "GET",
    ({ workspace, repoSlug, commitHash }) =>
      `/2.0/repositories/${workspace}/${repoSlug}/commit/${commitHash}`,
    z
      .object({
        workspace: z.string(),
        repoSlug: z.string(),
        commitHash: z.string(),
      })
      .describe("Retrieve a specific commit by hash"),
  );
  const pullRequests = request(
    "GET",
    ({ workspace, repoSlug }) =>
      `/2.0/repositories/${workspace}/${repoSlug}/pullrequests`,
    z
      .object({ workspace: z.string(), repoSlug: z.string() })
      .describe("List all pull requests in a repository"),
  );
  const pullRequest = request(
    "GET",
    ({ workspace, repoSlug, pullRequestId }) =>
      `/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}`,
    z
      .object({
        workspace: z.string(),
        repoSlug: z.string(),
        pullRequestId: z.string(),
      })
      .describe("Retrieve a specific pull request"),
  );
  const pullRequestComments = request(
    "GET",
    ({ workspace, repoSlug, pullRequestId }) =>
      `/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}/comments`,
    z
      .object({
        workspace: z.string(),
        repoSlug: z.string(),
        pullRequestId: z.string(),
      })
      .describe("List comments on a pull request"),
  );

  return {
    userInfo,
    workspaces,
    repositories,
    repository,
    branches,
    commits,
    commit,
    pullRequests,
    pullRequest,
    pullRequestComments,
  };
}
