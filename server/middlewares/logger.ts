import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { defineMiddleware } from "@vanilla-jsx/middleware/mod.ts";
import { getLogger } from "@std/log/mod.ts";
import { stringify } from "@std/yaml/stringify.ts";

const convertBody = async (body: Request | Response) => {
  try {
    return await body.clone().json();
  } catch (e) {
    const text = await body.clone().text();
    if (text.length > 90) {
      return `${text.slice(0, 30)} ... <省略 ${
        text.length - 60
      } 个字符> ... ${text.slice(-30)}`;
    }
    return text;
  }
};

export default defineMiddleware(async (req, next) => {
  try {
    const logger = getLogger("fetch");
    const { path, searchParams, method, headers } = req;
    const debugLog = {
      id: nanoid(),
      startTime: Date.now(),
      path,
      method,
      searchParams: searchParams && Object.fromEntries(searchParams.entries()),
      headers: headers && Object.fromEntries(headers.entries()),
    };
    logger.info(`===> ${debugLog.method} ${debugLog.path} ====>`);
    (async () => {
      const reqBody = await convertBody(req);
      logger.debug(
        stringify({
          type: "===>",
          ...debugLog,
          body: reqBody,
        }, {
          skipInvalid: true
        })
      );
    })();
    const res = await next();
    (async () => {
      const { status, statusText } = res;
      const endTime = Date.now();
      const resBody = await convertBody(res);
      logger.debug(
        stringify({
          type: "<===",
          ...debugLog,
          endTime,
          status,
          statusText,
          body: resBody,
        }, {
          skipInvalid: true
        })
      );
      const logStr = `<=== ${debugLog.method} ${
        debugLog.path
      } <=== ${status} 耗时: ${endTime - debugLog.startTime}ms`;
      if (status === 200) {
        logger.info(logStr);
      } else {
        logger.warning(logStr);
      }
    })();
    return res.clone();
  } catch (error) {
    console.error(error);
    return new Response("500", {
      status: 500,
    });
  }
});
