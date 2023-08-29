import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

const globalForDB = globalThis as unknown as {
  db: PrismaClient | undefined;
};

const db =
  globalForDB.db ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForDB.db = db;


export default db;
