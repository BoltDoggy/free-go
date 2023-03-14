import { canvas, ctx } from "./main-canvas";
import { drawBg, pi } from "./bg-canvas";
import { user, cps, otherCps } from "./chess-piece";

console.log("use", user.x, user.y); //

const vMap = {
  x: 0,
  y: 0,
};

let creating:
  | {
      x: number;
      y: number;
      t?: number;
    }
  | undefined;
const createTimeout = 1000;
const cpSize = 20;

const frame = (t: number) => {
  requestAnimationFrame(frame);

  ctx?.clearRect(0, 0, canvas.width, canvas.height);

  const rx = canvas.width / 2 + vMap.x;
  const ry = canvas.height / 2 + vMap.y;

  drawBg(ctx, rx, ry);

  ctx?.beginPath();
  ctx?.arc(rx, ry, 5, 0, 2 * Math.PI);
  ctx?.fill();

  if (creating) {
    if (!creating.t) {
      creating.t = t;
    }
    const ti = t - creating.t!;
    if (ti > createTimeout) {
      cps.push([creating.x, creating.y]);
      localStorage.myCps = JSON.stringify(cps);
      creating = undefined;
    } else {
      ctx?.beginPath();
      ctx?.arc(
        (creating.x - user.x) * 50 + rx,
        (creating.y - user.y) * 50 + ry,
        20,
        0,
        2 * Math.PI * (ti / createTimeout)
      );
      ctx?.stroke();
    }
  }

  cps.forEach(([cx, cy]) => {
    const cpx = (cx - user.x) * 50 + rx;
    const cpy = (cy - user.y) * 50 + ry;
    ctx?.beginPath();
    ctx?.arc(cpx, cpy, cpSize, 0, 2 * Math.PI);
    ctx?.fill();
  });

  otherCps.forEach(([cx, cy]) => {
    const cpx = (cx - user.x) * 50 + rx;
    const cpy = (cy - user.y) * 50 + ry;
    ctx?.beginPath();
    ctx?.arc(cpx, cpy, cpSize, 0, 2 * Math.PI);
    ctx?.stroke();
  });
};
requestAnimationFrame(frame);

const dragState = {
  draging: false,
  sx: 0,
  sy: 0,
  vmx: 0,
  vmy: 0,
};

const dragStart = (e) => {
  dragState.sx = e.x;
  dragState.sy = e.y;
  dragState.vmx = vMap.x;
  dragState.vmy = vMap.y;
  dragState.draging = true;
}

document.addEventListener("mousedown", (e) => {
  dragStart(e);
});

document.addEventListener("touchstart", (e) => {
  const { clientX, clientY } = e.touches[0];
  dragStart({
    x: clientX,
    y: clientY
  })
});

const dragEnd = () => {
  dragState.draging = false;
}

document.addEventListener("mouseup", (e) => {
  dragEnd();
});

document.addEventListener("touchend", (e) => {
  dragEnd();
});

const dragMove = (e) => {
  if (dragState.draging) {
    vMap.x = dragState.vmx + e.x - dragState.sx;
    vMap.y = dragState.vmy + e.y - dragState.sy;
  }
}

document.addEventListener("mousemove", (e) => {
  dragMove(e);
});

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const { clientX, clientY } = e.touches[0];
  dragMove({
    x: clientX,
    y: clientY
  });
})

document.addEventListener("dblclick", (e) => {
  const x = e.x - canvas.width / 2 - vMap.x;
  const y = e.y - canvas.height / 2 - vMap.y;
  const xd = x % pi;
  const yd = y % pi;
  const cpSizeHalf = cpSize / 2;
  if (
    (xd < cpSizeHalf || xd > pi - cpSizeHalf) &&
    (yd < cpSizeHalf || yd > pi - cpSizeHalf)
  ) {
    creating = {
      x: user.x + Math.round(x / pi),
      y: user.y + Math.round(y / pi),
      t: undefined,
    };
  }
});