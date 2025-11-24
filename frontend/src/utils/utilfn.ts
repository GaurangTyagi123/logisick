export const formatCurrency = (amount: number,currency?:string) => {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency || "INR",
        notation : "standard"
    }).format(amount);
}
export function prefereableUnits(amount: number,type:"weight" | "volume" = "weight"): string {
    if (amount >= 1000) return `${Math.round(amount / 10) / 100} K${type === "volume"? "l" : "g"}(s)`;
    else if (amount < 1 && amount > 0)
        return `${Math.round(amount * 100000) / 100} m${type === "volume"? "l" : "g"}(s)`;
    return `${amount} ${type === "volume"? "l" : "g"}(s)`;
}