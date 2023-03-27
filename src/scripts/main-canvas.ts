import { vMapToCanvas } from "./v-map.ts";

export const canvas = document.getElementById("cj") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");

const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

init();
self.addEventListener("resize", () => {
  init();
});

export const drawHome = () => {
  const [rx, ry] = vMapToCanvas(0, 0);
  ctx?.beginPath();
  ctx?.arc(rx, ry, 5, 0, 2 * Math.PI);
  ctx?.fill();
}