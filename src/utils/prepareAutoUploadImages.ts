import fs from 'fs';
import ImagesController from '../controllers/imagesController';
import { copyFile } from 'fs/promises';
import path from 'path';
import { ImageClass, ImageModel } from '../models/imageModel';

const prepareAutoUploadImages = () => {
  const autoLoadFolderPath = __dirname + '/www/uploads/autoUpload';

  fs.readdir(autoLoadFolderPath, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    for (const file of files) {
      try {
        const fileExtension = file.slice(file.lastIndexOf('.') + 1, file.length).toLowerCase();

        if (['jpg', 'jpeg', 'webp', 'png'].indexOf(fileExtension) === -1) {
          console.error(`Fixtures: ${file} has unsupported file extension`);
          continue;
        }

        const imageId = file.slice(0, 24);
        const uploadFolderPath = ImagesController.IMAGES_PATH + file;

        await copyFile(path.join(autoLoadFolderPath, file), uploadFolderPath);

        const imageFromDb: ImageClass = await ImageModel.findById(imageId);

        if (imageFromDb?.deleted) {
          await ImageModel.deleteOne({ _id: imageId });

          console.log(`Fixtures: ${file} was deleted from db`);
        }

        if (!imageFromDb) {
          await ImageModel.create({
            _id: imageId,
            originalExtension: fileExtension,
          });

          console.log(`Fixtures: ${file} was initialized`);

          continue;
        }

        console.log(`Fixtures: ${file} image was moved to uploads`);
      } catch (error) {
        console.error(`Fixtures: failed to load fixture file: ${file}`, error);
      }
    }
  });
};

export default prepareAutoUploadImages;
