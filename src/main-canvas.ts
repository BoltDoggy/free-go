export const canvas = document.getElementById("cj") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export const ctx = canvas.getContext('2d');