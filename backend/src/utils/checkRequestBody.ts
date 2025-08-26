export default (body: Record<string, string>, illegalFields: Array<string>) => {
    let newBody: Record<string, string> = Object();
    Object.keys(body).forEach((field) => {
        if (!illegalFields.includes(field)) newBody[field] = body[field];
    });
    return newBody;
};

 