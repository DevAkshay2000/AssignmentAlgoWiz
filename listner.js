const WebSocket = require("ws");
const Jsondata = require("./data.json");
// Connect to the WebSocket server
const ws = new WebSocket("ws://localhost:8080");
const chalk = require("chalk")
//1. check whether order exist
const checkExist = (val) => {
    const compareData = Jsondata;
    // conditions to check redundunt data
    return compareData.find((record) =>
        record.AppOrderID === val.AppOrderID &&
        record.record1 === val.record1 &&
        record.price === val.price &&
        record.triggerPrice === val.triggerPrice &&
        record.priceType === val.priceType &&
        record.productType === val.productType &&
        record.status === val.status &&
        record.exchange === val.exchange &&
        record.symbol === val.symbol);
};
//2. action handler based on the order type
const handleAction = (val) => {
    if (
        (val.priceType === "MKT" && val.status === "complete") ||
        (val.priceType === "LMT" && val.status === "open") ||
        (["SL-LMT", "SL-MKT"].includes(val.priceType) &&
            val.status === "pending"
        ) && !checkExist(val)
    ) {
        console.log(chalk.green("Order Placed For: ", val.AppOrderID, "\n"));
    }
    else if (
        (val.priceType === "MKT" && val.status === "complete") ||
        (val.priceType === "LMT" && val.status === "open") ||
        (["SL-LMT", "SL-MKT"].includes(val.priceType) &&
            val.status === "pending") &&
        checkExist(val)
    ) {
        console.log(chalk.blue("Order Modified For: ", val.AppOrderID, "\n"));
    }
    else if (
        ["LMT", "SL-LMT", "SL-MKT"].includes(val.priceType) &&
        val.status === "cancelled"
    ) {
        console.log(chalk.red("Order Cancelled: ", val.AppOrderID, "\n"));
    } else {
        //the order will be invalid if not passes any criteria
        console.log(chalk.cyanBright("Invalid Order: ", val.AppOrderID, "\n"));

    }
}

ws.on("open", () => {
    console.log("Connected to WebSocket server");
});
let lastUpdatedAt = 0
ws.on("message", (data) => {
    //only 1 batch will be send to updater/action handler and skip remainig 
    if (!lastUpdatedAt || Date.now() - lastUpdatedAt >= 1000) {
        const updates = JSON.parse(data);
        //1. filter out duplicate entries
        const uniques = [];
        updates.map((val, index) => {

            if (uniques.find((record) =>
                record.AppOrderID === val.AppOrderID &&
                record.record1 === val.record1 &&
                record.price === val.price &&
                record.triggerPrice === val.triggerPrice &&
                record.priceType === val.priceType &&
                record.productType === val.productType &&
                record.status === val.status &&
                record.exchange === val.exchange &&
                record.symbol === val.symbol)) {
            } else {
                uniques.push(val);
            }
        });
        //log filterData
        console.log(chalk.bgMagenta("Filtered Data: "), JSON.stringify(uniques))
        //3 . determein actions
        uniques.forEach((val) => {
            console.log(`Update sent to order book at ${Date.now()} for ClientID ${val.AppOrderID} :${JSON.stringify(val)}`);
            //4. send data to action handler
            handleAction(val)

        });
        lastUpdatedAt = Date.now()
    } else {
        console.log(chalk.red("skipping this updates because got two updates in exact 1 second of time"))
    }
});

ws.on("error", (err) => {
    console.error("WebSocket error:", err);
});

ws.on("close", () => {
    console.log("WebSocket connection closed");
});
