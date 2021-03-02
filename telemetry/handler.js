const axios = require("axios"); 
const url = require("url");
const wrapAxios = require('zipkin-instrumentation-axiosjs');
const {HttpLogger} = require('zipkin-transport-http')
const { Tracer, ExplicitContext, ConsoleRecorder,option: {Some, None}, Instrumentation,  BatchRecorder, jsonEncoder: {JSON_V2} } = require('zipkin');
const recorder = new BatchRecorder({
    logger: new HttpLogger({
      endpoint: 'http://zipkin.kyma-system:9411/api/v2/spans',
      jsonEncoder: JSON_V2
    })
  });
const tracer = new Tracer({ ctxImpl:new ExplicitContext(), recorder: recorder, localServiceName: "svc-a" })
const zipkinAxios = wrapAxios(axios, { tracer });

module.exports = {
    main: async function (event, context) {
      const req = event.extensions.request;

      function readHeader(header) {
        const val = req.header(header);
        if (val != null) {
          return new Some(val);
        } else {
          return None;
        }
      }
console.log("Trace header: %s", JSON.stringify(req.headers));
        const instrumentation = new Instrumentation.HttpServer({tracer,serviceName:"svc-a",port:0});
        const id = instrumentation.recordRequest(req.method, url.parse(req.originalUrl), readHeader);
        console.log("Trace Data: %s", JSON.stringify(id));
        console.log("Event data: %s", JSON.stringify(event.data));

        /*if(Date.now() % 2 == 0){
            res = event.extensions.response;
            res.writeHead(400, {'Content-Type': 'text/plain', 'some': 'header'});
            res.end();
            console.log("Bad timing")
            return
        }*/

        await zipkinAxios.post(`${process.env.SERVICE_URL}`, { orderCode: event.data.orderCode });
        console.log(`message=svc-a notified, traceId=${id.traceId}`);
        return
    }
};
