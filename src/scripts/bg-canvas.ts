import { ctx as targetCtx } from "./main-canvas";
import { vMapToCanvas } from "./v-map";

export const bgOffset = 10;
export const pi = 50;
export const cpCapacityRef = {
  current: 0,
};
const bgCanvas = document.createElement("canvas");
const ctx = bgCanvas.getContext("2d");

const init = () => {
  cpCapacityRef.current = Math.ceil(
    Math.max(window.innerWidth, window.innerHeight) / pi
  );
  const baseSize = cpCapacityRef.current * pi;

  bgCanvas.width = baseSize;
  bgCanvas.height = baseSize;

  for (let px = bgOffset; px < baseSize; px += pi) {
    for (let py = bgOffset; py < baseSize; py += pi) {
      ctx?.beginPath();
      ctx?.arc(px, py, 0.5, 0, 2 * Math.PI);
      ctx?.fill();
    }
  }
};

init();
window.addEventListener("resize", () => {
  init();
});

export const drawBg = () => {
  const [rx, ry] = vMapToCanvas(0, 0);
  const rxi = rx > 0 ? bgCanvas.width : -bgCanvas.width;
  const ryi = ry > 0 ? bgCanvas.height : -bgCanvas.height;
  const rxo = (rx % bgCanvas.width) - bgOffset;
  const ryo = (ry % bgCanvas.height) - bgOffset;
  targetCtx?.drawImage(bgCanvas, rxo, ryo, bgCanvas.width, bgCanvas.height);
  targetCtx?.drawImage(
    bgCanvas,
    rxo - rxi,
    ryo,
    bgCanvas.width,
    bgCanvas.height
  );
  targetCtx?.drawImage(
    bgCanvas,
    rxo,
    ryo - ryi,
    bgCanvas.width,
    bgCanvas.height
  );
  targetCtx?.drawImage(
    bgCanvas,
    rxo - rxi,
    ryo - ryi,
    bgCanvas.width,
    bgCanvas.height
  );
};
