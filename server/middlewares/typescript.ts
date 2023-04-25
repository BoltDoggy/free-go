import { JsxEmit, ModuleKind, transpileModule } from "npm:typescript";
import { onion } from "@vanilla-jsx/server-router/mod.ts";
import { serveFile } from "@std/http/file_server.ts";
import { resolve, join, extname } from "@std/path/mod.ts";

export default (dir: string) => {
  return onion.defineMiddleware(async (req, next) => {
    if (req._url?.pathname) {
      const ext = extname(req._url.pathname);
      if (ext && ext !== ".ts" && ext !== ".tsx") return next();
      const filepath = join(
        resolve(Deno.cwd(), dir),
        ext ? req._url.pathname : req._url.pathname + ".ts"
      );
      const res = await serveFile(req, filepath);
      if (res.status === 200) {
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
      }
      return res;
    }
    return next();
  });
};
