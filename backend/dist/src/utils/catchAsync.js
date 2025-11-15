"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Catches all the asynchronous errors and passes them to the global error handler
// eslint-disable-next-line
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
