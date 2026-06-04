## 2025-06-02 - Indexing Foreign Keys for filtering
**Learning:** Filtering by foreign keys (like `storeId`) in a frequently accessed table (`capture`) can become a bottleneck as the table grows if an explicit index is missing.
**Action:** Ensure frequently filtered columns have appropriate database indexes, and remember to generate Drizzle migrations for schema changes.
