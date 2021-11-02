import { ServerResponse } from 'http';

export const sendHttpJsonResponse = (
  res: ServerResponse,
  errorCode: number,
  error: any
) => {
  res.writeHead(errorCode, { 'content-type': 'application/json' });
  res.end(JSON.stringify(error));
};
