const axios = require("axios");
var redis = require("redis");
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient(process.env.AZ_uri);

module.exports = {
    main: async function (event, context) {
        console.log("Event data: %s", JSON.stringify(event.data));

        let orderUrl = `${process.env.GATEWAY_URL}/test/orders/${encodeURIComponent(event.data.orderCode)}`
        console.log("Order URL: %s", JSON.stringify(orderUrl));
        let response = await axios.get(orderUrl);
        console.log("Order Data: %s", JSON.stringify(response.data));

        let result = await client.setAsync("order", JSON.stringify(response.data, null, 2))
        console.log("Data handed over: %s", result);
        return
    }
};
