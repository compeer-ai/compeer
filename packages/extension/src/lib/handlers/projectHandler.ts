import { backend } from "../../lib/utilities/backend";

async function read() {
  const response = await backend.api.v1.projects.$get();
  const json = await response.json();
  return json;
}

export const projectHandler = {
  read,
};
