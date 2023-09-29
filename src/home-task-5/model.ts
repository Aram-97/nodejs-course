import http from "http";

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface Route {
  method: HTTP_METHOD;
  path: string;
  resolver: (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    ...params: string[]
  ) => void;
}

export interface HypermediaLink {
  method: HTTP_METHOD;
  href: string;
  rel: string;
}

export type DataWithHypermediaLinks<T extends object> = T & {
  links: HypermediaLink[];
};
