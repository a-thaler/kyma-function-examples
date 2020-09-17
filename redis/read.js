var redis = require("redis");
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Add your cache name and access key.
var client = redis.createClient(process.env.AZ_uri);

module.exports = {
    main: async function (event, context) {
        let value = await client.getAsync("order")
        console.log("Got " + value)
        if (value) {
            await client.delAsync("order")
        }
        return "" + value
    }
};
