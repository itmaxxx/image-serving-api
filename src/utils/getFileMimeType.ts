export const getMimeType = (path: string) => {
  if (!path) throw { message: 'Path is empty' };

  const dotPosition = path.lastIndexOf('.');

  if (dotPosition == -1) {
    return 'text/plain';
  }

  const extension = path.substring(dotPosition + 1);
  switch (extension) {
    case 'html':
    case 'css':
      return 'text/' + extension;
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
    case 'webp':
      return 'image/' + extension;
    case 'json':
      return 'application/' + extension;
    default:
      return 'text/plain';
  }
};
