import { JsxEmit, ModuleKind, transpileModule } from "npm:typescript";
import { onion } from "@vanilla-jsx/server-router/mod.ts";
import { extname } from "@std/path/mod.ts";

export default () => {
  return onion.defineMiddleware(async (req, next) => {
    if (!req._url?.pathname) return next();

    const ext = extname(req._url.pathname);
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
};
