function handleInvTypeFormat(investmentType) {
    if (investmentType.toLowerCase().includes("coin")) {
         return (investmentType.toUpperCase().slice(0, -4)) + "Coin"
    }
    return investmentType[0].toUpperCase() + investmentType.toLowerCase().slice(1);
};

module.exports = {
    handleInvTypeFormat
}