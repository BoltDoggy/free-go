import { canvas, ctx, drawHome } from "./main-canvas.ts";
import { drawBg, pi } from "./bg-canvas.ts";
import { drawMyCps, drawOtherCps, cpSize, polling } from "./chess-piece.ts";
import { canvasToVMap, homeTo, vMapToCp } from "./v-map.ts";
import { dragEnd, dragMove, dragStart } from "./drag-event.ts";
import { creatingRef, drawCreatingCps } from "./chess-piece-creating.ts";
import { addCp } from "./api.ts";
import Mine from "./components/Mine.tsx";
import { h, render } from "preact";

const app = document.getElementById("app");
app && render(<Mine />, app);

homeTo(0, 0);

requestAnimationFrame(polling);

const frame = (t: number) => {
  requestAnimationFrame(frame);

  ctx?.clearRect(0, 0, canvas.width, canvas.height);

  drawBg();
  drawHome();
  drawMyCps();
  drawOtherCps();
  drawCreatingCps(t);
};
requestAnimationFrame(frame);

document.addEventListener("mousedown", (e) => dragStart(e));
document.addEventListener("mouseup", () => dragEnd());
document.addEventListener("mousemove", (e) => dragMove(e));

document.addEventListener("touchstart", (e) => {
  const { clientX, clientY } = e.touches[0];
  dragStart({
    x: clientX,
    y: clientY,
  });
});
document.addEventListener("touchend", () => {
  dragEnd();
});
document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const { clientX, clientY } = e.touches[0];
  dragMove({
    x: clientX,
    y: clientY,
  });
});

document.addEventListener("dblclick", (e) => {
  const [_x, _y] = canvasToVMap(e.x, e.y);
  const xd = _x % pi;
  const yd = _y % pi;

  if ((xd < cpSize || xd > pi - cpSize) && (yd < cpSize || yd > pi - cpSize)) {
    const [x, y] = vMapToCp(_x, _y);
    addCp({
      x,
      y,
    });
    creatingRef.current = {
      x,
      y,
      t: undefined,
    };
  }
});

const socket = new WebSocket("ws://localhost:8000/ws-go");

socket.onopen = () => {
  console.log("socket opened");
  socket.send("bolt");
};
socket.onmessage = (e) => {
  console.log("socket message:", e.data);
  // socket.send(new Date().toString());
};
socket.onerror = (e) => console.log("socket errored:", e);
socket.onclose = () => console.log("socket closed");
