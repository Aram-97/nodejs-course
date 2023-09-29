import http from "http";

export function getRequestBody(req: http.IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function handleRequestError(res: http.ServerResponse<http.IncomingMessage>, error: unknown) {
  console.error(error);

  if (error instanceof Error) {
    res.statusCode = 500;
    res.end(JSON.stringify(error.toString()));
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
}
