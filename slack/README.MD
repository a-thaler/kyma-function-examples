# Slack Notification

Function for posting order creation events to slack.
These steps are performed:

- listen for order.created events
- calls back Commerce to retrieve full order details
- posts message to slack

Expects following env variables:

| Name | Example value | Description |
|---|---|---|
| `SLACK_URL` | `https://hooks.slack.com/services/xxx/yyy/zzz` | Slack webhook URL |
| `GATEWAY_URL` | `http://xxx.kyma-integration.svc.local` | Commerce Webservices API URL injected by Kyma Appplication Connectivity |
