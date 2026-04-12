FROM oven/bun:1-slim
ARG BARQUE_USERNAME
ARG BARQUE_PASSWORD
WORKDIR /app

COPY package.json ./
COPY packages/web/package.json ./packages/web/
COPY packages/scrape/package.json ./packages/scrape/

RUN bun install 

COPY . .

COPY ./packages/web/.env.production ./packages/web/.env
RUN bun run --cwd packages/web bun --bun run build

CMD ["bun", "packages/web/build/index.js"]
