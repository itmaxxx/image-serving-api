import * as formidable from 'formidable';
import { sendHttpJsonResponse } from '../utils/sendHttpJsonResponse';
import { IncomingMessage, ServerResponse } from 'http';
import { Types } from 'mongoose';
import { moveFile } from '../utils/moveFile';
import { ImageClass, ImageModel } from '../models/imageModel';
import { serveFile } from '../utils/serveFile';
import * as fs from 'fs';
import { convertImage } from '../utils/convertImage';

export default class ImagesController {
  // https://regex101.com/r/jO9pe9/1
  public static IMAGE_URL_PATTERN = /^\/uploads\/([0-9A-z]{24})\.(jpg|jpeg|png|webp)$/;
  public static IMAGES_PATH = './src/www/uploads/';

  public async uploadImage(req: IncomingMessage, res: ServerResponse) {
    try {
      const form = new formidable.IncomingForm();

      form.parse(req, async function (err, fields, files) {
        if (err) {
          throw err;
        }

        const file: any = (files.upload as any)?.length ? files.image[0] : files.image;

        if (!file) {
          return sendHttpJsonResponse(res, 403, { message: 'File not passed' });
        }

        if (['image/jpg', 'image/jpeg', 'image/webp', 'image/png'].indexOf(file.mimetype) === -1) {
          return sendHttpJsonResponse(res, 403, {
            message: 'File mime type not supported',
          });
        }

        const fileExtension = file.originalFilename.slice(
          file.originalFilename.lastIndexOf('.') + 1,
          file.originalFilename.length
        );

        if (['jpg', 'jpeg', 'webp', 'png'].indexOf(fileExtension) === -1) {
          return sendHttpJsonResponse(res, 403, {
            message: 'File extension not supported',
          });
        }

        const imageId = new Types.ObjectId();
        const imageName = imageId + '.' + fileExtension;
        const oldPath = file._writeStream.path;
        const newPath = ImagesController.IMAGES_PATH + imageName;

        moveFile(oldPath, newPath);

        await ImageModel.create({
          _id: imageId,
          originalExtension: fileExtension,
        });

        await sendHttpJsonResponse(res, 200, {
          message: 'Image uploaded',
          imageId,
          link: `${process.env.API_URL}/uploads/${imageName}`,
        });
      });
    } catch (error: any) {
      sendHttpJsonResponse(res, 500, {
        message: error.message || 'Failed to upload image',
      });
    }
  }

  public async serveImage(req: IncomingMessage, res: ServerResponse) {
    try {
      const decomposedUrl = req.url.match(ImagesController.IMAGE_URL_PATTERN);
      const imageId = decomposedUrl[1];
      const imageExtension = decomposedUrl[2];

      console.log({ imageExtension });

      const imageFromDb: ImageClass = await ImageModel.findById(imageId);

      if (!imageFromDb || imageFromDb.deleted) {
        return sendHttpJsonResponse(res, 404, {
          message: 'Image not found or deleted',
        });
      }

      const requestedImagePath = ImagesController.IMAGES_PATH + imageId + '.' + imageExtension;

      if (!fs.existsSync(requestedImagePath)) {
        const originalImagePath =
          ImagesController.IMAGES_PATH + imageId + '.' + imageFromDb.originalExtension;

        await convertImage(originalImagePath, requestedImagePath);
      }

      return await serveFile(requestedImagePath, res);
    } catch (error) {
      return sendHttpJsonResponse(res, 404, {
        message: 'Failed to serve image',
      });
    }
  }
}
