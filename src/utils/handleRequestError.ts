import { sendHttpJsonResponse } from './sendHttpJsonResponse';
import { ServerResponse } from 'http';

/**
 * Used to handle request error in catch block
 * @param error
 * @param res
 * @param errorMessage
 */
export const handleRequestError = (
  error: any,
  res: ServerResponse,
  errorMessage: string = null
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(error);
  }

  return sendHttpJsonResponse(res, 400, {
    message: errorMessage ? errorMessage : error?.message,
  });
};
