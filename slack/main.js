const axios = require("axios");

module.exports = {
    main: async function (event, context) {
        console.log("Event data: %s", JSON.stringify(event.data));

        let orderUrl = `${process.env.GATEWAY_URL}/test/orders/${encodeURIComponent(event.data.orderCode)}`
        console.log("Order URL: %s", JSON.stringify(orderUrl));
        let response = await axios.get(orderUrl);
        console.log("Order Data: %s", JSON.stringify(response.data));
        await axios.post(`${process.env.SLACK_URL}`, { text: `Order details: ${JSON.stringify(response.data, null, 2)}` });
        return
    }
};
