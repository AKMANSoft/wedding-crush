/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["wedding-crush.s3.eu-central-1.amazonaws.com"]
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
