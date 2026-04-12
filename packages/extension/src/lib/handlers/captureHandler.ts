import { backend } from "../../lib/utilities/backend";

export async function createTextCapture(text: string, projectId: string) {
  const response = await backend.api.v1.capture.$post({
    json: {
      type: "text",
      content: text,
      projectId,
    },
  });
  return response;
}

export async function createUrlCapture(content: string, projectId: string) {
  const response = await backend.api.v1.capture.$post({
    json: {
      type: "url",
      content,
      projectId,
    },
  });
  const json = await response.json();
  return json;
}

export const captureHandler = {
  createTextCapture,
  createUrlCapture,
};
