/**
 * @brief Function to remove illegal fields from body
 * @params request body(object), illegalFields (array of strings)
 * @approach create a new object (newBody).
 *          iterate through the fields of body and check whether illegalFields array contains that field
 *          If it does not contain that field then add it to the newBody object
 * @returns newBody(Object)
 */
export default (body: Record<string, string>, fields: Array<string>,include:boolean=false) => {
    const newBody: Record<string, string> = Object();
    Object.keys(body).forEach((field) => {
        if (!include && !fields.includes(field)) newBody[field] = body[field];
        else if (include && fields.includes(field)) newBody[field] = body[field] ;
    });
    return newBody;
};
