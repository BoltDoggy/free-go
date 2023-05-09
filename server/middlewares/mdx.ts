import { defineMiddleware } from "@vanilla-jsx/server-router/mod.ts";
import { compile } from "npm:@mdx-js/mdx";
import { FileExtContext } from "./init-file-ext.ts";

export const [mdxMiddleware] = defineMiddleware(
  "mdxMiddleware",
  async (safe, _req, next) => {
    const { ext } = safe.useContext(FileExtContext);
    if (ext !== ".md" && ext !== ".mdx") return next();

    const res = await next();
    if (!res) return res;

    res.headers.set("content-type", "text/javascript");
    if (res.status !== 200) return res;

    const source = await res.text();
    const result = await compile(source, {
        jsxImportSource: 'npm:preact'
    });
    res.headers.delete('content-length');
    return new Response(result.toString(), {
      headers: res.headers,
    });
  }
);
