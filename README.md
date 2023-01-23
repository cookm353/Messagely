# Message.ly

Message.ly is a simple private messaging app.  It's meant as an exercise to reinforce authentication and authorization patterns using bcrypt and JWT.

## Instructions

Run the following commands to install all dependencies, create the database, and start the server.

```BASH
npm i
psql < data.sql
nodemon dist/server.js
```

## Routes

### **Authorization Related Routes**

`POST /auth/login`

- Log user in

`POST /auth/register`

- Register new user

### **User Related Routes**

`GET /users`

- Return list of users

`GET /users/:username`

- Get user details

`GET /users/:username/to`

- Get messages received by user

`GET /users/:username/from`

- Get messages sent by user

### **Message Related Routes**

`GET /messages/:id`

- Retrieve message detail
- Messages can only be viewed by sender or recipient
  
`POST /messages`

- Send a new message

`POST /messages/:id/read`

- Mark message as read
- Can only be used by message's recipient

## Packages Used

- Bcrypt
- Express
- jsonwebtoken
- pg
- Nunjucks
- Jest
- Supertest
- Axios

## Takeaways

- Middleware is useful for simplifying route definitions and enforcing DRY
- When assigning an alias to a column name in a SQL query, you need to use double quotes
- Store the username and password for the DB in .env, add .env to .gitignore
