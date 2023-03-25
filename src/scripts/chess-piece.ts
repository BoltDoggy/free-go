import type { cps } from "../../server/graphql/graphql.generated";
import { queryCps } from "./api";
import { cpCapacityRef } from "./bg-canvas";
import { ctx } from "./main-canvas";
import { cpToCanvas, getCenterCp } from "./v-map";

export const cpSize = 20;

const cps: cps = {};

export const polling = async (t) => {
  try {
    const [x, y] = getCenterCp();
    const { cps: nowCps } = await queryCps({
      x,
      y,
      r: cpCapacityRef.current,
    });

    cps.my = nowCps.my;
    cps.other = nowCps.other;
  } catch (error) {
    console.error(error);
  }

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, 1000);
  });
  requestAnimationFrame(polling);
};

export const drawMyCps = () => {
  cps.my?.forEach((cp) => {
    if (cp && cp.x !== undefined && cp.y !== undefined) {
      const [cpx, cpy] = cpToCanvas(cp.x, cp.y);
      ctx?.beginPath();
      ctx?.arc(cpx, cpy, cpSize, 0, 2 * Math.PI);
      ctx?.fill();
    }
  });
};

export const drawOtherCps = () => {
  cps.other?.forEach((cp) => {
    if (cp && cp.x !== undefined && cp.y !== undefined) {
      const [cpx, cpy] = cpToCanvas(cp.x, cp.y);
      ctx?.beginPath();
      ctx?.arc(cpx, cpy, cpSize, 0, 2 * Math.PI);
      ctx?.stroke();
    }
  });
};
