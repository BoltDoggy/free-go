import { JsxEmit, ModuleKind, transpileModule } from "npm:typescript";
import {
  RouterContext,
  defineMiddleware,
} from "@vanilla-jsx/server-router/mod.ts";
import { extname } from "@std/path/mod.ts";

export const [typescript] = defineMiddleware("typescript", async (safe, _req, next) => {
  const { url } = safe.useContext(RouterContext);
  if (!url.pathname) return next();

  const ext = extname(url.pathname);
  if (ext !== ".ts" && ext !== ".tsx") return next();

  const res = await next();
  if (!res || res.status !== 200) return res;

  const source = await res.text();
  const result = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      jsx: JsxEmit.React,
      jsxFactory: "h",
      jsxFragmentFactory: "Fragment",
    },
  });
  res.headers.set("content-type", "text/javascript");
  return new Response(result.outputText, {
    headers: res.headers,
  });
});
