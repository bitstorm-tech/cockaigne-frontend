import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  if (process.env.LOCAL_DEV) {
    const env = loadEnv(mode, process.cwd());
    process.env.DO_SPACES_REGION = env.VITE_DO_SPACES_REGION;
    process.env.DO_SPACES_BASE_URL = env.VITE_DO_SPACES_BASE_URL;
    process.env.DO_SPACES_BUCKET = env.VITE_DO_SPACES_BUCKET;
    process.env.DO_SPACES_SECRET = env.VITE_DO_SPACES_SECRET;
    process.env.DO_SPACES_KEY = env.VITE_DO_SPACES_KEY;
    process.env.DO_SPACES_ENDPOINT = env.VITE_DO_SPACES_ENDPOINT;
    process.env.PGCERT = env.VITE_PGCERT;
    process.env.DATABASE_URL = env.VITE_DATABASE_URL;
    process.env.JWT_SECRET = env.VITE_JWT_SECRET;
  }
  return defineConfig({
    plugins: [sveltekit()],
    server: {
      port: 3000
    }
  });
};
