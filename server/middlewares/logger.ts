import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { onion } from "@vanilla-jsx/server-router/mod.ts";
import { getLogger } from "@std/log/mod.ts";
import { stringify } from "@std/yaml/stringify.ts";
import { gray } from "@std/fmt/colors.ts";

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

export default () =>
  onion.defineMiddleware(async (req, next) => {
    try {
      const logger = getLogger("fetch");
      const { method, headers, _url } = req;
      const debugLog = {
        id: nanoid(),
        startTime: Date.now(),
        pathname: _url?.pathname,
        method,
        searchParams:
          _url?.searchParams &&
          Object.fromEntries(Object.entries(_url?.searchParams)),
        headers: headers && Object.fromEntries(Object.entries(headers)),
      };
      logger.info(gray(`===> ${debugLog.method} ${debugLog.pathname} ====>`));
      (async () => {
        const reqBody = await convertBody(req);
        logger.debug(
          stringify(
            {
              type: "===>",
              ...debugLog,
              body: reqBody,
            },
            {
              skipInvalid: true,
            }
          )
        );
      })();
      const res = await next();
      if (res) {
        (async () => {
          const { status, statusText } = res;
          const endTime = Date.now();
          const resBody = await convertBody(res);
          logger.debug(
            stringify(
              {
                type: "<===",
                ...debugLog,
                endTime,
                status,
                statusText,
                body: resBody,
              },
              {
                skipInvalid: true,
              }
            )
          );
          const logStr = `<=== ${debugLog.method} ${
            debugLog.pathname
          } <=== ${status} 耗时: ${endTime - debugLog.startTime}ms`;
          if (status === 200) {
            logger.info(logStr);
          } else {
            logger.warning(logStr);
          }
        })();
        return res.clone();
      }
    } catch (error) {
      console.error(error);
      return new Response("500", {
        status: 500,
      });
    }
  });
