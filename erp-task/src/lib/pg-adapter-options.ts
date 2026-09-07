/**
 * `?schema=` in DATABASE_URL is honoured by the Prisma migration engine
 * (`prisma migrate deploy`, `prisma migrate status`) but @prisma/adapter-pg
 * ignores it -- it always schema-qualifies generated SQL using the `schema`
 * option passed as PrismaPg's *second* constructor argument, defaulting to
 * `public` when it's absent. Every PrismaClient in this project (the app and
 * every standalone script) needs this or queries silently miss tables that
 * live outside `public`.
 */
export function pgAdapterOptions(): { schema?: string } {
  const url = process.env.DATABASE_URL;
  const schema = url ? (new URL(url).searchParams.get("schema") ?? undefined) : undefined;
  return { schema };
}
