FROM oven/bun:1-slim
WORKDIR /app

COPY package.json ./
COPY bun.lock ./

COPY packages/web ./packages/web
COPY packages/scrape ./packages/scrape
COPY packages/scrape/tsconfig.json ./packages/scrape/

RUN bun install

RUN bun run --cwd packages/web build

COPY packages/web/ddl packages/web/build/server/ddl

ENV ORIGIN=http://localhost:3000 

CMD ["bun", "packages/web/build/index.js"]

EXPOSE 3000