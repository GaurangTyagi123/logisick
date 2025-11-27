export const formatCurrency = (amount: number, currency?: string) => {
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency: currency || "INR",
		notation: "standard",
	}).format(amount);
};
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
	return Math.ceil(
		(dateThen.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
	);
}