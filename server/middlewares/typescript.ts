import { JsxEmit, ModuleKind, transpileModule } from "npm:typescript";
import { defineMiddleware } from "@vanilla-jsx/server-router/mod.ts";
import { FileExtContext } from "./init-file-ext.ts";

export const [typescript] = defineMiddleware(
  "typescript",
  async (safe, _req, next) => {
    const { ext } = safe.useContext(FileExtContext);
    if (ext !== ".ts" && ext !== ".tsx") return next();

    const res = await next();
    if (!res) return res;

    res.headers.set("content-type", "application/javascript; charset=utf-8");
    if (res.status !== 200) return res;

    const source = await res.text();
    const result = transpileModule(source, {
      compilerOptions: {
        module: ModuleKind.ESNext,
        jsx: JsxEmit.React,
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    });
    return new Response(result.outputText, {
      headers: res.headers,
    });
  }
);
