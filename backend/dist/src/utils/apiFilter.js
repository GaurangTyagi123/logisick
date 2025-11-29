"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @brief class to handle pagination, limiting, sorting and other operation
 * @param {any} query query on mongoose search
 * @param {ParsedQs} queryString query string to operate on
 */
class ApiFilter {
    queryString;
    query;
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "limit", "sort", "fields"];
        excludedFields.forEach((field) => delete queryObj[field]);
        let queryStr = JSON.stringify(queryObj).replace(/\bgt|gte|lt|lte|eq\b/, (match) => `$${match}`);
        queryStr = queryStr.replace(/"(\d+)"/g, "$1"); // removes quotes around numbers
        if (this.query instanceof mongoose_1.default.Aggregate) {
            this.query.pipeline().push({ $match: JSON.parse(queryStr) });
        }
        else if (this.query instanceof mongoose_1.default.Query) {
            this.query.find(JSON.parse(queryStr));
        }
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort;
            sortBy = sortBy.split(",").join(" ");
            this.query.sort(sortBy);
        }
        else {
            this.query.sort("-createdAt name");
        }
        return this;
    }
    project() {
        if (this.queryString.fields) {
            let fields = this.queryString.fields;
            fields = fields.split(",").join(" ");
            if (this.query instanceof mongoose_1.default.Aggregate) {
                const fieldObj = {};
                fields.split(" ").forEach((field) => (fieldObj[field] = 1));
                this.query.pipeline().push({ $project: fieldObj });
            }
            else if (this.query instanceof mongoose_1.default.Query) {
                this.query.select(fields);
            }
        }
        else {
            if (!(this.query instanceof mongoose_1.default.Aggregate))
                this.query.select("-__v");
        }
        return this;
    }
    paginate(totalPages) {
        const limit = Number(this.queryString.limit) || 5;
        const page = Number(this.queryString.page) || 1;
        if (page * limit > totalPages)
            return this;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.default = ApiFilter;
