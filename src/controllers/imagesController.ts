import * as formidable from 'formidable';
import * as fs from 'fs';
import { sendHttpJsonResponse } from '../utils/sendHttpJsonResponse';
import { IncomingMessage, ServerResponse } from 'http';

export default class ImagesController {
  public async uploadImage(req: IncomingMessage, res: ServerResponse) {
    try {
      const form = new formidable.IncomingForm();

      await form.parse(req, async function (err, fields, files) {
        if (err) {
          throw err;
        }

        const file: any = (files.upload as any)?.length
          ? files.image[0]
          : files.image;

        if (!file) {
          return sendHttpJsonResponse(res, 403, { message: 'File not passed' });
        }

        if (
          ['image/jpg', 'image/jpeg', 'image/webp', 'image/png'].indexOf(
            file.mimetype
          ) === -1
        ) {
          return sendHttpJsonResponse(res, 403, { message: 'Image type not supported' });
        }

        await fs.rename(
          file._writeStream.path,
          './src/www/public/uploads/original/' + file.originalFilename,
          (err) => {
            if (err) throw err;
          }
        );

        await sendHttpJsonResponse(res, 200, { message: 'Your file uploaded' });
      });
    } catch (error: any) {
      sendHttpJsonResponse(res, 500, {
        message: error.message || 'Failed to upload file',
      });
    }
  }
}
