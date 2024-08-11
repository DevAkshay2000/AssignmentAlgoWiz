function generateRandomOrderData(numOrders) {
    const transactions = ['buy', 'sell'];
    const exchanges = ['NSE', 'BSE'];
    const symbols = ['SBI', 'WIPRO', 'HCL', 'HDFC', 'TCS', 'ICICI'];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateOrderID() {
        return Math.floor(Math.random() * 1000000000);
    }

    function formatDate() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + Math.floor(Math.random() * 60));
        return date.toISOString().replace('T', ' ').slice(0, 19);
    }

    const orders = [];

    for (let i = 0; i < numOrders; i++) {
        const order = {
            AppOrderID: generateOrderID(),
            price: parseFloat((Math.random() * 30).toFixed(2)),
            triggerPrice: parseFloat((Math.random() * 30).toFixed(2)),
            priceType: Math.random() > 0.5 ? 'LMT' : 'MKT',
            productType: Math.random() > 0.5 ? 'E' : 'I',
            status: Math.random() > 0.5 ? 'complete' : 'pending',
            CumulativeQuantity: Math.floor(Math.random() * 20) + 1,
            LeavesQuantity: Math.floor(Math.random() * 10),
            OrderGeneratedDateTimeAPI: formatDate(),
            transaction: getRandomElement(transactions),
            AlgoID: `ALG${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
            exchange: getRandomElement(exchanges),
            symbol: getRandomElement(symbols)
        };
        orders.push(order);
    }

    return orders;
}

module.exports = generateRandomOrderData