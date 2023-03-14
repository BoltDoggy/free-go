import typescript from "npm:typescript";
import { defineMiddleware } from "@vanilla-jsx/middleware/mod.ts";
import { serveFile } from "@std/http/file_server.ts";
import { resolve, join, extname } from "@std/path/mod.ts";

export default (dir: string) => {
  return defineMiddleware(async (req, next) => {
    try {
      if (req.path) {
        const ext = extname(req.path);
        if (ext && ext !== ".ts") return next();
        const filepath = join(
          resolve(Deno.cwd(), dir),
          ext ? req.path : req.path + ".ts"
        );
        const res = await serveFile(req, filepath);
        if (res.status === 200) {
          const source = await res.text();
          const result = typescript.transpileModule(source, {
            compilerOptions: { module: typescript.ModuleKind.ESNext },
          });
          res.headers.set('content-type', 'text/javascript');
          return new Response(result.outputText, {
            headers: res.headers,
          });
        }
        return res;
      }
      return next();
    } catch (e) {
      console.error(e);
      return next();
    }
  });
};
