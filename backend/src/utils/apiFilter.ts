import mongoose from "mongoose";
import { ParsedQs } from "qs";

/**
 * @brief class to handle pagination, limiting, sorting and other operation
 * @param {any} query query on mongoose search 
 * @param {ParsedQs} queryString query string to operate on
 */
export default class ApiFilter {
	private queryString: ParsedQs;
	public query;

	constructor(query: any, queryString: ParsedQs) {
		this.query = query;
		this.queryString = queryString;
	}
	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ["page", "limit", "sort", "fields"];
		excludedFields.forEach((field) => delete queryObj[field]);

		let queryStr = JSON.stringify(queryObj).replace(
			/\bgt|gte|lt|lte|eq\b/,
			(match) => `$${match}`
		);
		queryStr = queryStr.replace(/"(\d+)"/g, "$1"); // removes quotes around numbers
		if (this.query instanceof mongoose.Aggregate) {
			this.query.pipeline().push({ $match: JSON.parse(queryStr) });
		} else if (this.query instanceof mongoose.Query) {
			this.query.find(JSON.parse(queryStr));
		}
		return this;
	}
	sort() {
		if (this.queryString.sort) {
			let sortBy = this.queryString.sort as string;
			sortBy = sortBy.split(",").join(" ");
			this.query.sort(sortBy);
		} else {
			this.query.sort("-createdAt name");
		}
		return this;
	}
	project() {
		if (this.queryString.fields) {
			let fields = this.queryString.fields as string;
			fields = fields.split(",").join(" ");
			if (this.query instanceof mongoose.Aggregate) {
				const fieldObj: Record<string, number> = {};
				fields.split(" ").forEach((field) => (fieldObj[field] = 1));
				this.query.pipeline().push({ $project: fieldObj });
			} else if (this.query instanceof mongoose.Query) {
				this.query.select(fields);
			}
		} else {
			if (!(this.query instanceof mongoose.Aggregate))
				this.query.select("-__v");
		}
		return this;
	}
	paginate(totalPages: number) {
		const limit: number = Number(this.queryString.limit) || 5;
		const page: number = Number(this.queryString.page) || 1;

		if (page * limit > totalPages) return this;

		const skip = (page - 1) * limit;
		this.query.skip(skip).limit(limit);
		return this;
	}
}
