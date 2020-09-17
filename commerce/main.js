const axios = require("axios");

module.exports = {
    main: async function (event, context) {
        console.log("Event data: %s", JSON.stringify(event.data));
        var traceHeaders = extractTraceHeaders(event.extensions.request.headers)

        let orderUrl = `${process.env.GATEWAY_URL}/test/orders/${encodeURIComponent(event.data.orderCode)}`
        console.log("Order URL: %s", JSON.stringify(orderUrl));
        let response = await axios.get(orderUrl, traceHeaders);
        console.log("Order Data: %s", JSON.stringify(response.data));

        return
    }
};

const traceHeaderNames = ['x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-Flags', 'x-ot-span-context']
function extractTraceHeaders(headers) {
    var map = {};
    for (var i in traceHeaderNames) {
        if (headers[traceHeaderNames[i]] !== undefined) {
            map[traceHeaderNames[i]] = headers[traceHeaderNames[i]]
        }
    }
    return { headers: map };
}
