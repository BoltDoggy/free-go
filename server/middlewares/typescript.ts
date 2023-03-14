import typescript from "npm:typescript";
import { defineMiddleware } from "@vanilla-jsx/middleware/mod.ts";

import { resolve, join } from "https://deno.land/std@0.128.0/path/mod.ts";

const decoder = new TextDecoder("utf-8");

export default (dir: string) => {
  return defineMiddleware(async (req, next) => {
    try {
      const filepath = join(resolve(Deno.cwd(), dir), req.path || "");
      const uint8Array = await Deno.readFile(filepath);
      const source = decoder.decode(uint8Array);
      const result = typescript.transpileModule(source, {
        compilerOptions: { module: typescript.ModuleKind.ESNext },
      });
      console.log(filepath, result);
      return new Response(result.outputText, {
        headers: {
          'Content-Type': 'text/javascript'
        }
      });
    } catch (e) {
      console.error(e);
      return next();
    }
  });
};
