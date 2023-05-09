import type { cps } from "../../../../server/graphql/graphql.generated.ts";
import { queryCps } from "./api.ts";
import { cpCapacityRef } from "./bg-canvas.ts";
import { ctx as targetCtx } from "./main-canvas.ts";
import { cpToCanvas, getCenterCp } from "./v-map.ts";

export const cpSize = 20;

const cps: cps = {};
const c0 = Math.random().toFixed(6).replace('0.', '#');
const c1 = Math.random().toFixed(6).replace('0.', '#');

const drawCp = (x: number, y: number) => {
  const cpCanvas = document.createElement("canvas");
  const ctx = cpCanvas.getContext("2d")!;

  cpCanvas.width = cpSize*2;
  cpCanvas.height = cpSize*2;

  const gradient = ctx.createLinearGradient(0, 0, cpSize*2, cpSize);
  gradient.addColorStop(0, `${c0}`);
  gradient.addColorStop(1, `${c1}`);
  ctx.beginPath();
  ctx.fillStyle = gradient || "#ff0000";
  ctx.arc(cpSize, cpSize, cpSize, 0, 2 * Math.PI);
  ctx.fill();

  targetCtx?.drawImage(
    cpCanvas,
    x - cpSize,
    y - cpSize,
    cpSize*2,
    cpSize*2
  );
};

export const polling = async () => {
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
    // console.log('bolt', cp)
    if (cp && cp.x !== undefined && cp.y !== undefined) {
      const [cpx, cpy] = cpToCanvas(cp.x, cp.y);
      drawCp(cpx, cpy);
    }
  });
};

export const drawOtherCps = () => {
  cps.other?.forEach((cp) => {
    if (cp && cp.x !== undefined && cp.y !== undefined) {
      const [cpx, cpy] = cpToCanvas(cp.x, cp.y);
      targetCtx?.beginPath();
      targetCtx?.arc(cpx, cpy, cpSize, 0, 2 * Math.PI);
      targetCtx?.stroke();
    }
  });
};
