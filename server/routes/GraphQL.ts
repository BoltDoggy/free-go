import { graphql, GraphQLArgs } from "npm:graphql";
import { readSchemaPromise, readSchema } from "../graphql/schema.ts";
import rootValue from "../graphql/root.ts";
import { defineMiddleware } from "../../@vanilla-jsx/server-router/mod.ts";
import { CookieContext } from "../middlewares/init-cookie-ctx.ts";

const ENV = Deno.env.get("ENV");

export const [GraphQL] = defineMiddleware("GraphQL", async (safe, req) => {
  const { cookies } = safe.useContext(CookieContext);
  const { query, variables, operationName } = (await req.json()) as unknown as {
    query: string;
    variables: GraphQLArgs["variableValues"];
    operationName: string;
  };
  const schema = ENV === "dev" ? await readSchema() : await readSchemaPromise;
  const json = await graphql({
    schema,
    source: query || `query A { __schema { queryType { name } } }`,
    rootValue,
    variableValues: variables,
    operationName,
    contextValue: {
      freeGo: cookies.freeGo,
    },
  });
  return new Response(JSON.stringify(json));
});
