import { pipeline, env } from "@huggingface/transformers";
import { type LibSQLDatabase } from "drizzle-orm/libsql/sqlite3";

export async function rag<T>(db: LibSQLDatabase<T>) {
  const DEFAULT_CHUNK_SIZE = 1000;
  const DEFAULT_CHUNK_OVERLAP = 200;
  env.allowLocalModels = true;

  const embeddingPipeline = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    {
      dtype: "auto",
    },
  );

  async function embed(text: string) {
    const result = await embeddingPipeline(text, {
      pooling: "mean",
      normalize: true,
    });

    return {
      embedding: Array.from(result.data) as number[],
    };
  }

  function chunkText(
    text: string,
    chunkSize = DEFAULT_CHUNK_SIZE,
    overlap = DEFAULT_CHUNK_OVERLAP,
  ) {
    if (chunkSize <= 0) {
      return [];
    }
    const safeOverlap = Math.max(0, Math.min(overlap, chunkSize - 1));
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);
      if (chunk.trim().length > 0) {
        chunks.push(chunk);
      }
      if (end >= text.length) {
        break;
      }
      start = end - safeOverlap;
    }
    return chunks;
  }

  async function embedChunks(
    text: string,
    options?: { chunkSize?: number; chunkOverlap?: number },
  ) {
    const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
    const chunkOverlap = options?.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP;
    const chunks = chunkText(text, chunkSize, chunkOverlap);
    const embeddings: { content: string; embedding: number[] }[] = [];
    for (const chunk of chunks) {
      const { embedding } = await embed(chunk);
      embeddings.push({ content: chunk, embedding });
    }
    return embeddings;
  }

  async function mainContext(query: string, workspace: string) {
    const { embedding } = await embed(query);
    const embeddingJson = JSON.stringify(embedding);
    const result = await db.$client.execute({
      sql: `
      SELECT 
		  cc.captureId as captureId,
		  cc.content,
		  vector_distance_cos(cc.embedding, vector32(?)) as distance
		FROM capture_chunk cc
		JOIN capture c ON c.id = cc.captureId
		JOIN store p ON p.id = c.storeId
		JOIN workspace w on w.id = p.workspaceId
		WHERE w.name = ? AND c.enabled = 1
		ORDER BY distance ASC
		LIMIT 7
		`,
      args: [embeddingJson, workspace],
    });

    const formattedResult = result.rows.map((row: any) => ({
      captureId: row.captureId as string,
      content: row.content as string,
    }));
    return formattedResult;
  }

  async function projectContext(
    query: string,
    workspace: string,
    store: string,
  ) {
    const { embedding } = await embed(query);
    const embeddingJson = JSON.stringify(embedding);
    const result = await db.$client.execute({
      sql: `
      SELECT 
		  cc.captureId as captureId,
		  cc.content,
		  vector_distance_cos(cc.embedding, vector32(?)) as distance
		FROM capture_chunk cc
		JOIN capture c ON c.id = cc.captureId
		JOIN store p ON p.id = c.storeId
		JOIN workspace w on p.workspaceId = w.id
		WHERE p.name = ? AND w.name = ? AND c.enabled = 1
		ORDER BY distance ASC
		LIMIT 7
		`,
      args: [embeddingJson, store, workspace],
    });

    const formattedResult = result.rows.map((row: any) => ({
      captureId: row.captureId as string,
      content: row.content as string,
    }));
    return formattedResult;
  }

  async function setupVectorIndex() {
    await db.$client.execute({
      sql: `CREATE INDEX IF NOT EXISTS capture_embedding_idx ON capture(libsql_vector_idx(embedding))`,
      args: [],
    });
    await db.$client.execute({
      sql: `CREATE INDEX IF NOT EXISTS capture_chunk_embedding_idx ON capture_chunk(libsql_vector_idx(embedding))`,
      args: [],
    });
  }

  return {
    embed,
    setupVectorIndex,
    projectContext,
    mainContext,
  };
}
