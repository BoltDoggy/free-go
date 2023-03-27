import { buildSchema } from "npm:graphql";
import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";

export async function readSchema() {
  const schemaStr = await Deno.readTextFile(
    resolve(dirname(fromFileUrl(import.meta.url)), "./schema.graphql")
  );
  return buildSchema(schemaStr);
}

export const readSchemaPromise = readSchema();
