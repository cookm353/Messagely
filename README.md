# Message.ly

## Instructions

---

Run the following commands to install all dependencies, create the database, and start the server.

```BASH
npm i
psql < data.sql
nodemon dist/server.js
```

## Routes

---

### Authorization Related Routes

`POST /auth/login`

- Log user in

`POST /auth/register`

- Register new user

### User Related Routes

`GET /users`

- Return list of users

`GET /users/:username`

- Get user details

`GET /users/:username/to`

- Get messages received by user

`GET /users/:username/from`

- Get messages sent by user

### Message Related Routes

`GET /messages/:id`

- Retrieve message detail
- Messages can only be viewed by sender or recipient
  
`POST /messages`

- Send a new message

`POST /messages/:id/read`

- Mark message as read
- Can only be used by message's recipient
