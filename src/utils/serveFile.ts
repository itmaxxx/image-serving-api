import fs from 'fs';
import { ServerResponse } from 'http';
import { getMimeType } from './getFileMimeType';

export const serveFile = async (
  path: string,
  res: ServerResponse,
  statusCode: number = 200
) => {
  if (!fs.existsSync(path)) throw { message: 'File not found' };

  const readStream = fs.createReadStream(path);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', getMimeType(path));
  readStream.pipe(res);
};
