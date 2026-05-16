import { createHighlighter } from "shiki";

export const highlighter = await createHighlighter({
  themes: ['tokyo-night'],
  langs: ['javascript', 'typescript', 'bash', 'json'],
})
