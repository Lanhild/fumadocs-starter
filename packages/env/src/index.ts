import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { getRuntimeVariable } from "./getRuntimeVariable"

declare const window: {
  __ENV?: any;
};

const baseEnv = {
  server: {
    NODE_ENV: z
      .enum(["development", "staging", "production", "test"])
      .optional(),
  },
  client: {
    NEXT_PUBLIC_TERMS_OF_SERVICE_URL: z
      .url()
      .optional()
      .default("https://konvergo.com/legal"),
    NEXT_PUBLIC_PRIVACY_POLICY_URL: z
      .url()
      .optional()
      .default("https://konvergo.com/legal"),
  },
  runtimeEnv: {
   
    NEXT_PUBLIC_TERMS_OF_SERVICE_URL: getRuntimeVariable(
      "NEXT_PUBLIC_TERMS_OF_SERVICE_URL",
    ),
    NEXT_PUBLIC_PRIVACY_POLICY_URL: getRuntimeVariable(
      "NEXT_PUBLIC_PRIVACY_POLICY_URL",
    ),
  },
};

export const env = createEnv({
  server: {
    ...baseEnv.server,
  },
  client: {
    ...baseEnv.client,
 
  },
  experimental__runtimeEnv: {
    ...baseEnv.runtimeEnv,

  },
  skipValidation:
    process.env.SKIP_ENV_CHECK === "true" ||
    (typeof window !== "undefined" && window.__ENV === undefined),
  onValidationError(error) {
    console.error(
      "❌ Invalid environment variables:",
      error,
    );
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(
        error,
      )}`,
    );
  },
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable on the client: ${variable}`,
    );
  },
});
