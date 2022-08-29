# Planning

mysql DB (use david's docker file)

react-query on frontend

## queries

### login

See David's [implementation](https://github.com/DavidRecheni/crypto-dex-backend)

- login with mm
- send public address
- get nonce from db
- sign nonce from frontend with MM and send to backend
- validate signature

if valid:

- refresh nonce in DB
- generate JWT?
- return user with JWT

if invalid:

- send not authenticated response

### once logged in

get user info

get messages
