import { ServerResponse } from 'http';

export const sendHttpJsonResponse = (res: ServerResponse, statusCode: number, data: any) => {
  res.writeHead(statusCode, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ...data, statusCode }));
};
