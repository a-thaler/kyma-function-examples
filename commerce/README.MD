# Commerce Connection

Function for receiving commerce events.
These steps are performed:

- listen for order.created events
- calls back Commerce to retrieve full order details, passes trace headers

Expects following env variables:

| Name | Example value | Description |
|---|---|---|
| `GATEWAY_URL` | `http://xxx.kyma-integration.svc.local` | Commerce Webservices API URL injected by Kyma Appplication Connectivity |
