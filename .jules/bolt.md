## 2025-06-02 - Selective column fetching for BLOBs
**Learning:** Fetching large `F32_BLOB` embedding columns (e.g., 384 dimensions) when they are not needed on the client leads to significant data transfer overhead and memory consumption, especially when listing records.
**Action:** Always use selective column fetching (projection) to exclude heavy columns in list views or remote queries that don't specifically require them.

## 2025-06-02 - Indexing Foreign Keys for filtering
**Learning:** Filtering by foreign keys (like `storeId`) in a frequently accessed table (`capture`) can become a bottleneck as the table grows if an explicit index is missing.
**Action:** Ensure frequently filtered columns have appropriate database indexes, and remember to generate Drizzle migrations for schema changes.
