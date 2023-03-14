export const createMiddleware = (
  tag: (props: Record<string, unknown>) => any,
  props: Record<string, unknown>,
  ...children: any[]
) => {
  if (typeof tag === "function") {
    return tag({
      children,
      ...props,
    });
  }
};
