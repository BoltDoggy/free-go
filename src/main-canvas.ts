export const canvas = document.getElementById("cj") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");

const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

init();
window.addEventListener("resize", () => {
  init();
});
