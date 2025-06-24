import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "c53f1nq8",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});