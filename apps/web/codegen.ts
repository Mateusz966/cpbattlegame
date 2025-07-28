import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const apiKey = process.env.NEXT_PUBLIC_GRAPHQL_API_KEY;

if (!graphqlUrl || !apiKey) {
  throw new Error("Missing GRAPHQL_API_KEY or NEXT_PUBLIC_GRAPHQL_URL");
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [graphqlUrl]: {
        headers: {
          "x-api-key": apiKey,
        },
      },
    } as Record<string, { headers: Record<string, string> }> // some issue with defining type
  ],
  documents: "gql/**/*.ts|gql/**/*.tsx",
  generates: {
    "gql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;
