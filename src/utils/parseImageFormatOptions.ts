import { ImageFormatOptions, ResizeOption } from '../types/imageFormatOptions'

export const parseImageFormatOptions = (paramsFromUrl: string): ImageFormatOptions => {
  const params: ImageFormatOptions = {};
  const urlParams = paramsFromUrl.split(',');

  for (let i = 0; i < urlParams.length; i++) {
    const param = urlParams[i];
    const paramValue = param.slice(2, param.length);
    let paramInt: number;

    switch (param.slice(0, 2)) {
      // Resize
      case 'r_':
        if (Object.values(ResizeOption).indexOf(paramValue as ResizeOption) !== -1) {
          params.resize = paramValue as ResizeOption;
        }
        break;
      // Width
      case 'w_':
        paramInt = parseInt(paramValue);
        if (paramInt >= 1 && paramInt <= 99999) {
          params.width = paramInt;
        }
        break;
      // Height
      case 'h_':
        paramInt = parseInt(paramValue);
        if (paramInt >= 1 && paramInt <= 99999) {
          params.height = paramInt;
        }
        break;
      // Quality
      case 'q_':
        paramInt = parseInt(paramValue);
        if (paramInt >= 1 && paramInt <= 100) {
          params.quality = paramInt;
        }
        break;
    }
  }

  return params;
}