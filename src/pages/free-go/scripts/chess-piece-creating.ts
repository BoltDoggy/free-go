import { ctx } from "./main-canvas.ts";
import { cpToCanvas } from "./v-map.ts";

export const creatingRef: {
  current?: {
    x: number;
    y: number;
    t?: number;
  };
} = {
  current: undefined,
};
const createTimeout = 1000;

export const drawCreatingCps = (t: number) => {
  if (creatingRef.current) {
    if (!creatingRef.current.t) {
      creatingRef.current.t = t;
    }
    const ti = t - creatingRef.current.t!;
    if (ti > createTimeout) {
      creatingRef.current = undefined;
    } else {
      ctx?.beginPath();
      const [cpx, cpy] = cpToCanvas(
        creatingRef.current.x,
        creatingRef.current.y
      );
      ctx?.arc(cpx, cpy, 20, 0, 2 * Math.PI * (ti / createTimeout));
      ctx?.stroke();
    }
  }
};
