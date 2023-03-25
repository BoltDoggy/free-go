import {
  buildSchema,
} from "https://cdn.skypack.dev/graphql?dts";
import {
  dirname,
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.128.0/path/mod.ts";

export async function readSchema() {
  const schemaStr = await Deno.readTextFile(
    resolve(dirname(fromFileUrl(import.meta.url)), "./schema.graphql")
  );
  return buildSchema(schemaStr);
}

export const readSchemaPromise = readSchema();
