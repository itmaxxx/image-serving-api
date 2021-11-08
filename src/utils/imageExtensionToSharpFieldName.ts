import { ImageExtension } from '../types/imageExtension';

const imageExtensionToSharpFieldName = (imageExtension: ImageExtension): string => {
  switch (imageExtension) {
    case ImageExtension.JPEG:
    case ImageExtension.JPG:
      return 'jpeg';
    default:
      return imageExtension;
  }
};

export default imageExtensionToSharpFieldName;
