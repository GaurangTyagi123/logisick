export const formatCurrency = (amount: number,currency?:string) => {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency || "INR",
        notation : "standard"
    }).format(amount);
}