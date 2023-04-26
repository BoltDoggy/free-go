import { defineMiddleware } from "../../@vanilla-jsx/server-router/mod.ts";

export const [WsGo] = defineMiddleware("WsGo", (_safe, req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => console.log("socket closed");
  return response;
});
