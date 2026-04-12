import { fetcher } from "../utilities/fetcher";
import { z } from "zod";

export function github(config: { token: string }) {
  const { request } = fetcher("https://api.github.com", config);
  const user = request("GET", () => "/user", z.object({}));
  const repo = request(
    "GET",
    ({ owner, repo }) => `/repos/${owner}/${repo}`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
      })
      .describe("Get authenticated user"),
  );
  const branches = request(
    "GET",
    ({ owner, repo }) => `/repos/${owner}/${repo}/branches`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
      })
      .describe("Get repository metadata"),
  );

  const repoTree = request(
    "GET",
    ({ owner, repo, ref }) =>
      `/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
        ref: z.string().default("HEAD"),
      })
      .describe("List repository branches"),
  );

  const fileContents = request(
    "GET",
    ({ owner, repo, path }) => `/repos/${owner}/${repo}/contents/${path}`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
        path: z.string(),
      })
      .describe("Get full repository tree"),
  );

  const commits = request(
    "GET",
    ({ owner, repo, per_page }) =>
      `/repos/${owner}/${repo}/commits?per_page=${per_page}`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
        per_page: z.number().default(30),
      })
      .describe("Get contents of a specific file"),
  );

  const pullRequests = request(
    "GET",
    ({ owner, repo, state }) => `/repos/${owner}/${repo}/pulls?state=${state}`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
        state: z.enum(["open", "closed", "all"]).default("open"),
      })
      .describe("List commits"),
  );

  const issues = request(
    "GET",
    ({ owner, repo, state }) => `/repos/${owner}/${repo}/issues?state=${state}`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
        state: z.enum(["open", "closed", "all"]).default("open"),
      })
      .describe("List pull requests"),
  );

  const languages = request(
    "GET",
    ({ owner, repo }) => `/repos/${owner}/${repo}/languages`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
      })
      .describe("List repository languages"),
  );

  const workflowRuns = request(
    "GET",
    ({ owner, repo }) => `/repos/${owner}/${repo}/actions/runs`,
    z
      .object({
        owner: z.string(),
        repo: z.string(),
      })
      .describe("List workflow runs (CI)"),
  );

  return {
    user,
    repo,
    branches,
    repoTree,
    fileContents,
    commits,
    pullRequests,
    issues,
    languages,
    workflowRuns,
  };
}
