/**
 * @brief function to format currency amount
 * @param {number} amount currency amount to format
 * @param {string?} currency curreny of the amount
 * @returns {string} formated currency string
 * @author `Gaurang Tyagi`
 */
export const formatCurrency = (amount: number, currency?: string) => {
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency: currency || "INR",
		notation: "standard",
	}).format(amount);
};

/**
 * @brief function to convert amount of weight or volume to perferable units
 * @param {number} amount amount of unit to convert
 * @param {"weight" | "volume"} type type of unit to make preferable
 * @returns {string} amount to preffered units
 * @author `Ravish Ranjan`
 */
export function prefereableUnits(
	amount: number,
	type: "weight" | "volume" = "weight"
): string {
	if (amount >= 1000)
		return `${Math.round(amount / 10) / 100} K${
			type === "volume" ? "l" : "g"
		}(s)`;
	else if (amount < 1 && amount > 0)
		return `${Math.round(amount * 100000) / 100} m${
			type === "volume" ? "l" : "g"
		}(s)`;
	return `${amount} ${type === "volume" ? "l" : "g"}(s)`;
}

/**
 * @brief function to convert amount units
 * @param {"MG" | "G" | "KG" | "ML" | "L" | "KL"} unit unit to convert to
 * @param {number} amount amount to convert 
 * @returns {number} converted amount by units
 */
export function unitConversion(
	unit: "MG" | "G" | "KG" | "ML" | "L" | "KL",
	amount?: number,
) {
	if (!amount) return amount;
	switch (unit) {
		case "KG":
			return amount * 1000;
		case "KL":
			return amount * 1000;
		case "MG":
			return amount / 1000;
		case "ML":
			return amount * 1000;
		default:
			return amount;
	}
}

/**
 * @brief function to get difference between given date and current date
 * @param {Date} date date to get difference from
 * @returns {number} differnce of days between given date and current date
 * @author `Ravish Ranjan`
 */
export function dateDifference(date: Date): number {
	const dateThen = new Date(date);
	const now = new Date();
	const diff:number =  Math.ceil(
		(dateThen.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
	)
	return diff > 0 ? diff : 0;
}