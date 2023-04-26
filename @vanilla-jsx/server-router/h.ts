import { BoltMiddleware } from "@bolt/onion/mod.ts";

export type ServerMiddleware = BoltMiddleware<Request, Response>;

export const createMiddleware = (
  tag: (props: Record<string, unknown>) => ServerMiddleware,
  props: Record<string, unknown>,
  ...children: ServerMiddleware[]
) => {
  if (typeof tag === "function") {
    return tag({
      children,
      ...props,
    });
  }
};
