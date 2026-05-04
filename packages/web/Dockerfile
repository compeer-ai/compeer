FROM oven/bun:1-slim
WORKDIR /app

COPY package.json ./
COPY bun.lock ./

COPY packages/web ./packages/web
COPY packages/scrape ./packages/scrape
COPY packages/scrape/tsconfig.json ./packages/scrape/

RUN bun install

ENV ORIGIN=http://localhost:3000
ENV SQLITE=file:data/sqlite.db

RUN bun run --cwd packages/web build
COPY packages/web/data app/data
COPY packages/web/ddl packages/web/build/server/ddl


CMD ["bun", "packages/web/build/index.js"]

EXPOSE 3000

VOLUME ["/app/data"]