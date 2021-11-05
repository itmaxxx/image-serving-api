import { Fields } from 'formidable';

export const checkIfAuthorized = (fields: Fields) => {
  if (process.env.SECRET_KEY) {
    if (!fields?.secret_key || fields['secret_key'] !== process.env.SECRET_KEY) {
      throw new Error('Not authorized');
    }
  }
};
