import {ServerResponse} from "http";

export const sendErrorHttpJsonResponse = (res: ServerResponse, errorCode: number, error: any) => {
	res.writeHead(errorCode, { 'content-type': 'application/json' });
	res.end(JSON.stringify(error));
}