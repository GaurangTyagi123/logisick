export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "EUR",
        notation : "compact"
    }).format(amount);
}