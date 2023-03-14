export interface BoltServerRequest extends Request {
  _url?: URL;
  path?: string;
  params?: Record<string, unknown>;
  searchParams?: URLSearchParams;
}

export type MiddlewareUse =
  | ((
      req: BoltServerRequest,
      next: () => Promise<Response>
    ) => Promise<Response>)
  | MiddlewareUse[]
  | undefined;
