import { graphql, GraphQLArgs } from "https://cdn.skypack.dev/graphql?dts";
import { readSchemaPromise, readSchema } from "../graphql/schema.ts";
import rootValue from "../graphql/root.ts";
import { defineMiddleware } from "@vanilla-jsx/middleware/mod.ts";

const ENV = Deno.env.get('ENV');

export default defineMiddleware(async (req) => {
  const {
    query,
    variables,
    operationName,
  } = await req.json() as unknown as {
    query: string;
    variables: GraphQLArgs["variableValues"];
    operationName: string;
  };
  const schema = ENV === 'dev' ? await readSchema() : await readSchemaPromise;
  const json = await graphql({
    schema,
    source: query || `query A { __schema { queryType { name } } }`,
    rootValue,
    variableValues: variables,
    operationName,
    contextValue: {
      freeGo: req.cookies?.freeGo
    }
  });
  return new Response(JSON.stringify(json));
});
