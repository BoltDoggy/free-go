import { onion } from "./mod.ts";

const testMiddleware = onion.defineMiddleware<{
  test: string;
}>((ctx) => {
  ctx._url?.host;
  return new Response();
});
