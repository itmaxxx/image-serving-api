export enum ResizeOption {
  Cover = 'cover',
  Contain = 'contain',
  Fill = 'fill',
  Inside = 'inside',
  Outside = 'outside',
}

export interface ImageFormatOptions {
  resize?: ResizeOption;
  width?: number;
  height?: number;
  quality?: number;
}
