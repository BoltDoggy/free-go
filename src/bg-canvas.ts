export const bgOffset = 10;
export const pi = 50;
const bgCanvas = document.createElement("canvas");
const ctx = bgCanvas.getContext("2d");

const init = () => {
  const baseSize =
    (Math.floor(
      (window.innerWidth > window.innerHeight
        ? window.innerWidth
        : window.innerHeight) / 50
    ) +
      1) *
    50;

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

export const drawBg = (targetCtx, rx, ry) => {
  const rxi = rx > 0 ? bgCanvas.width : -bgCanvas.width;
  const ryi = ry > 0 ? bgCanvas.height : -bgCanvas.height;
  const rxo = (rx % bgCanvas.width) - bgOffset;
  const ryo = (ry % bgCanvas.height) - bgOffset;
  targetCtx.drawImage(bgCanvas, rxo, ryo, bgCanvas.width, bgCanvas.height);
  targetCtx.drawImage(
    bgCanvas,
    rxo - rxi,
    ryo,
    bgCanvas.width,
    bgCanvas.height
  );
  targetCtx.drawImage(
    bgCanvas,
    rxo,
    ryo - ryi,
    bgCanvas.width,
    bgCanvas.height
  );
  targetCtx.drawImage(
    bgCanvas,
    rxo - rxi,
    ryo - ryi,
    bgCanvas.width,
    bgCanvas.height
  );
};
