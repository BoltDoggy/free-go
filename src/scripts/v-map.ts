import { pi } from "./bg-canvas";
import { canvas } from "./main-canvas";

export const vMap = {
  x: 0,
  y: 0,
  homeX: 0,
  homeY: 0,
};

export const homeTo = (homeX: number, homeY: number) => {
  vMap.homeX = homeX;
  vMap.homeY = homeY;
};

export const offsetTo = (x: number, y: number) => {
  vMap.x = x;
  vMap.y = y;
};

export const vMapToCanvas = (x: number, y: number) => {
  return [canvas.width / 2 + vMap.x + x, canvas.height / 2 + vMap.y + y];
};

export const canvasToVMap = (x: number, y: number) => {
  return [x - canvas.width / 2 - vMap.x, y - canvas.height / 2 - vMap.y];
};

export const cpToVMap = (x: number, y: number) => {
  return [(x - vMap.homeX) * pi, (y - vMap.homeY) * pi];
};

export const vMapToCp = (x: number, y: number) => {
  return [vMap.homeX + Math.round(x / pi), vMap.homeY + Math.round(y / pi)];
};

export const cpToCanvas = (x: number, y: number) => {
  const [_x, _y] = cpToVMap(x, y);
  return vMapToCanvas(_x, _y);
};

export const getCenterCp = () => {
  return vMapToCp(-vMap.x, -vMap.y);
};
