const WebSocket = require('ws');
const fs = require('fs');
const data = require("./data.json")
const wss = new WebSocket.Server({ port: 8080 });
// 1. delays and count to generate and send data to listner
const delaysAndCount = [
  { delay: 1000, count: 10 },
  { delay: 0, count: 2 },
  { delay: 2000, count: 20 },
  { delay: 3000, count: 40 },
  { delay: 5000, count: 30 },
];

//2. function to generate random orders data 
function generateRandomOrderData(count) {
  return Array.from({ length: count }, (_, index) => ({
    AppOrderID: 1111000000 + index,
    price: Math.floor(Math.random() * 10) + 1,
    triggerPrice: Math.floor(Math.random() * 10) + 1,
    priceType: ["MKT", "LMT", "SL-LMT", "SL-MKT"][Math.floor(Math.random() * 4)],
    productType: "I",
    status: ["complete", "open", "pending", "cancelled"][Math.floor(Math.random() * 4)],
    CumulativeQuantity: Math.floor(Math.random() * 10),
    LeavesQuantity: Math.floor(Math.random() * 10),
    OrderGeneratedDateTimeAPI: new Date().toISOString(),
    transaction: ["buy", "sell"][Math.floor(Math.random() * 2)],
    AlgoID: "",
    exchange: "NSE",
    symbol: ["IDEA", "RELIANCE", "TATA", "BAJAJ", "WIPRO", "ONGC"][Math.floor(Math.random() * 6)],
  }));
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  //generate data 
  delaysAndCount.forEach(({ delay, count }, index) => {
    setTimeout(() => {
      const result = generateRandomOrderData(count);
      console.log(`Sending ${count} orders with delay ${delay}ms`);

      fs.writeFileSync('data.json', JSON.stringify(result, null, 2), (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Data successfully written to data.json');
        }
      });

      ws.send(JSON.stringify(result));
    }, delay);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
