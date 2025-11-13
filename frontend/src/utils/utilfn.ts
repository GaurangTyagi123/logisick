export const formatCurrency = (amount: number,currency:string) => {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency || "USD",
        notation : "standard"
    }).format(amount);
}