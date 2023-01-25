# Message.ly

Message.ly is a simple private messaging app.  It's meant as an exercise to reinforce authentication and authorization patterns using bcrypt and JWT.

## Instructions

First run the following commands to download the requirements and create the database and environment variable file.

```
npm i
psql < data.sql
touch .env
```

`.env` should have the following fields:

```
PGUSER=<user name>
PGPASSWORD=<password>
key=<JWT secret key>
```

After filling in the fields, you can start the server with the following command:

```BASH
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
- When creating a new user, the most recent login date should be the same as the registration date
- Middleware for authenticate JWTs should be applied to every route
- The front end needs to store the JWT and send it with every request
