import { offsetTo, vMap } from "./v-map.ts";

const dragState = {
  dragging: false,
  sx: 0,
  sy: 0,
  vmx: 0,
  vmy: 0,
};

export const dragStart = (e) => {
  dragState.sx = e.x;
  dragState.sy = e.y;
  dragState.vmx = vMap.x;
  dragState.vmy = vMap.y;
  dragState.dragging = true;
};

export const dragEnd = () => {
  dragState.dragging = false;
};

export const dragMove = (e: { x: number; y: number }) => {
  if (dragState.dragging) {
    offsetTo(
      dragState.vmx + e.x - dragState.sx,
      dragState.vmy + e.y - dragState.sy
    );
  }
};
