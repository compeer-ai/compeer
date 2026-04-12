import pkg from "$web/package.json";
import path from "node:path";
import { $ } from "bun";

const DOCKER_USER = "barque";
const IMAGE_NAME = "barque";
const VERSION = pkg.version;
const FULL_IMAGE = `${DOCKER_USER}/${IMAGE_NAME}:${VERSION}`;
const ROOT_DIR = path.resolve(import.meta.dir, "../../..");
const DOCKERFILE = path.resolve(ROOT_DIR, "packages", "web", "Dockerfile");
const DOCKER_USERNAME = Bun.env.DOCKER_USER;
const DOCKER_PASSWORD = Bun.env.DOCKER_PASSWORD;

await $`echo "${DOCKER_PASSWORD}" | docker login --username ${DOCKER_USERNAME} --password-stdin`.quiet();
await $`docker build -f ${DOCKERFILE} -t ${FULL_IMAGE} -t ${DOCKER_USER}/${IMAGE_NAME}:latest ${ROOT_DIR}`;
await $`docker push ${FULL_IMAGE}`;
await $`docker push ${DOCKER_USER}/${IMAGE_NAME}:latest`;
