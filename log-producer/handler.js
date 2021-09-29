module.exports = {
    main: function (event, context) {
        startLogger(event.extensions.request.headers)
        return "Log thread triggered"
    }
}

async function startLogger(headers) {
    var index = 0
    console.log("Starting log thread for request " + headers["x-request-id"])
    while (true) {
        console.log(JSON.stringify({
            "number": index,
            "request": headers["x-request-id"]
        }))
        index++
        await sleep(10);
    }
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
