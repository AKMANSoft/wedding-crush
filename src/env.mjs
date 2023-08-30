import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.string().url(),
    BASE_URL: z.string().url(),
    AWS_BUCKET: z.string(),
    AWS_KEY: z.string(),
    AWS_SECRET: z.string(),
    AWS_REGION: z.string(),
  },


  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BASE_URL: process.env.BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_KEY: process.env.AWS_KEY,
    AWS_SECRET: process.env.AWS_SECRET,
    AWS_REGION: process.env.AWS_REGION,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
