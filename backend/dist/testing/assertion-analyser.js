"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertionAnalyser = assertionAnalyser;
/**
 * Parses an object-like string (array, object, function args) from a given index.
 */
function objParser(str, init = 0) {
    const openSym = ["[", "{", '"', "'", "("];
    const closeSym = ["]", "}", '"', "'", ")"];
    let type;
    for (let i = init; i < str.length; i++) {
        type = openSym.indexOf(str[i]);
        if (type !== -1) {
            const open = openSym[type];
            const close = closeSym[type];
            let count = 1;
            for (let k = i + 1; k < str.length; k++) {
                if (open === '"' || open === "'") {
                    if (str[k] === close)
                        count--;
                    if (str[k] === "\\")
                        k++;
                }
                else {
                    if (str[k] === open)
                        count++;
                    if (str[k] === close)
                        count--;
                }
                if (count === 0) {
                    const obj = str.slice(i, k + 1);
                    return { start: i, end: k, obj };
                }
            }
            return null;
        }
    }
    return null;
}
/**
 * Replaces object-like parts of the string with placeholders.
 */
function replacer(str) {
    let obj;
    let cnt = 0;
    const data = [];
    while ((obj = objParser(str)) !== null) {
        data[cnt] = obj.obj;
        str =
            str.substring(0, obj.start) +
                "__#" +
                cnt++ +
                str.substring(obj.end + 1);
    }
    return {
        str,
        dictionary: data,
    };
}
/**
 * Splits a string by commas, taking into account object-like placeholders.
 */
function splitter(str) {
    const strObj = replacer(str);
    let args = strObj.str.split(",");
    args = args.map((a) => {
        let m = a.match(/__#(\d+)/);
        while (m) {
            a = a.replace(/__#(\d+)/, strObj.dictionary[parseInt(m[1])]);
            m = a.match(/__#(\d+)/);
        }
        return a.trim();
    });
    return args;
}
/**
 * Analyses an assertion string and extracts method names and arguments.
 */
function assertionAnalyser(body) {
    if (!body)
        return "invalid assertion";
    const cleanedBody = body.match(/(?:browser\s*\.\s*)?assert\s*\.\s*\w*\([\s\S]*\)/);
    if (cleanedBody && Array.isArray(cleanedBody)) {
        body = cleanedBody[0];
    }
    else {
        return [];
    }
    const s = replacer(body);
    const splittedAssertions = s.str.split("assert");
    const assertions = splittedAssertions.slice(1);
    const assertionBodies = [];
    const methods = assertions.map((a, i) => {
        const m = a.match(/^\s*\.\s*(\w+)__#(\d+)/);
        if (!m)
            return "";
        assertionBodies.push(parseInt(m[2]));
        const pre = splittedAssertions[i].match(/browser\s*\.\s*/)
            ? "browser."
            : "";
        return pre + m[1];
    });
    if (methods.some((m) => !m))
        return "invalid assertion";
    const bodies = assertionBodies.map((b) => s.dictionary[b].slice(1, -1).trim());
    return methods.map((method, i) => ({
        method,
        args: splitter(bodies[i]),
    }));
}
