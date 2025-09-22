import type { NextFunction, Request, Response } from "express";

// catches all the asynchronous errors and passes them to the global error handler
// eslint-disable-next-line
const catchAsync = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};
export default catchAsync;
