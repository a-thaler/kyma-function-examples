# LogProducer Notification

Function for spamming logs to stdout:

- listen for incoming requests/events
- starts a never ending thread per incoming request
- thread logs a message every 10s
