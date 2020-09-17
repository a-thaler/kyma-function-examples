const axios = require("axios");

module.exports = {
    main: async function (event, context) {
        let status = "hold";
        console.log("Event data: %s", JSON.stringify(event.data));
        var traceHeaders = extractTraceHeaders(event.extensions.request.headers)

        let comment = await getComment(event.data.commentId, traceHeaders);
        console.log("Comment: %s", comment.content.raw);

        let score = await findSentiment(comment.content.raw);
        if (score > 0.2) {
            status = "approved"
        }
        console.log("Sentiment score: %s, Comment status: %s", JSON.stringify(score), JSON.stringify(status));

        updateComment(comment.id, status, comment.content.raw, score, traceHeaders);
    }
};

async function getComment(id, traceHeaders) {
    let commentUrl = `${process.env.GATEWAY_URL}/wp/v2/comments/${encodeURIComponent(id)}?context=edit`
    console.log("Wordpress URL: %s", JSON.stringify(commentUrl));
    let response = await axios.get(commentUrl, traceHeaders);
    return response.data;
}

async function findSentiment(comment) {
    let requestUrl = `${process.env.textAnalyticsEndpoint}text/analytics/v2.1/sentiment`
    console.log("Azure Sentiment URL: %s", JSON.stringify(requestUrl));

    let response = await axios.post(requestUrl, { documents: [{ id: 1, text: comment }] }, { headers: { 'Ocp-Apim-Subscription-Key': process.env.textAnalyticsKey } })
    return response.data.documents[0].score
}

async function updateComment(id, status, comment, score, traceHeaders) {
    let requestUrl = `${process.env.GATEWAY_URL}/wp/v2/comments/${encodeURIComponent(id)}`;
    return await axios.post(requestUrl, { status: status, content: comment + "\n--\nscore:" + score }, traceHeaders);
}

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
