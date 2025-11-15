"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @brief Function to remove/include fields from body
 * @param request body(object),
 * @param fields (array of strings)
 * @param include (boolean)
 * @approach create a new object (newBody).
 *          iterate through the fields of body and check whether fields array contains that field
 *          If it does not contain that field and include is true then add it to the newBody object
 * @returns newBody(Object)
 */
exports.default = (body, fields, include = false) => {
    const newBody = Object();
    Object.keys(body).forEach((field) => {
        if (!include && !fields.includes(field))
            newBody[field] = body[field];
        else if (include && fields.includes(field))
            newBody[field] = body[field];
    });
    return newBody;
};
