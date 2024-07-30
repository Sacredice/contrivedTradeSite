export function handleCamelCase(investmentType) {
    if (investmentType.toLowerCase().includes("coin")) {
         return investmentType.toLowerCase().slice(0, -4) + "Coin"
    }
    return investmentType.toLowerCase();
};


export function calcMaxQty(transactionType, balance, price, ownedQty) {
    const formattedTransactionType = transactionType.toLowerCase();
    if ( formattedTransactionType === "buy") {
        return Math.floor(Number(balance) / price);
    } else {
         return Number(ownedQty);
    }
}
