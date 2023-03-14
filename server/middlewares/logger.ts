import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { logJson } from "../utils/logInfo.ts";
import { defineMiddleware } from "@vanilla-jsx/middleware/mod.ts";

const convertBody = async (body: Request | Response) => {
  try {
    return await body.clone().json();
  } catch (e) {
    const text = await body.clone().text();
    if (text.length > 90) {
      return `${text.slice(0, 30)} ... <省略 ${
        text.length - 90
      } 个字符> ... ${text.slice(-30)}`;
    }
    return text;
  }
};

export const logger = defineMiddleware(async (req, next) => {
  try {
    const id = nanoid();
    const { path, searchParams, method } = req;
    (async () => {
      const reqBody = await convertBody(req);
      logJson({
        type: "===>",
        id,
        path: path,
        time: Date.now(),
        method,
        searchParams:
          searchParams && Object.fromEntries(searchParams.entries()),
        body: reqBody,
      });
    })();
    const res = await next();
    (async () => {
      const { status, statusText } = res;
      const resBody = await convertBody(res);
      logJson({
        type: "<===",
        id,
        path,
        time: Date.now(),
        status,
        statusText,
        body: resBody,
      });
    })();
    return res.clone();
  } catch (error) {
    console.error(error);
    return new Response("500", {
      status: 500,
    });
  }
});
