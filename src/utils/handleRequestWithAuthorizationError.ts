import { sendHttpJsonResponse } from './sendHttpJsonResponse';
import { ServerResponse } from 'http';
import { handleRequestError } from './handleRequestError';

/**
 * Used to handle request error which requires authorization
 * @param error
 * @param res
 * @param errorMessage
 */
export const handleRequestWithAuthorizationError = (
  error: any,
  res: ServerResponse,
  errorMessage: string = null
) => {
  if (error?.message === 'Not authorized') {
    return sendHttpJsonResponse(res, 401, {
      message: error.message,
    });
  }

  return handleRequestError(error, res, errorMessage);
};
