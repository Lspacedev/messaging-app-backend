# PERN Messaging App | BACKEND

Messaging App API that allows users to send and recieve messages.

### Messaging App | Frontend

[https://github.com/Lspacedev/messaging-app-frontend](https://github.com/Lspacedev/messaging-app-frontend)

## Prerequisites

- Nodejs
- Prisma
- A Supabase account, follow the link [here](https://supabase.com/)

## Installation

1. Clone the repository

```bash
git@github.com:Lspacedev/messaging-app-backend.git
```

2. Navigate to the project folder

```bash
cd messaging-app-backend
```

3.  Install all dependencies

```bash
npm install
```

4. Create an env file and add the following:

```bash
DATABASE_URL="Postgres database Uri"

JWT_SECRET="Jwt secret"

SUPABASE_PROJECT_URL="Supabase project url"
SUPABASE_ANON_KEY="Supabase anon key"
CLIENT_URL="Client app url"

```

5. Run the project

```bash
node app
```

## Usage

1. The server should run on PORT 3000, unless a port is specified.
2. Use http://localhost:3000, to test the API on Postman or any other tool.

## Routes:

API is built using a Node Express server, with PostgreSQL as a database.
API uses JWT tokens to authenticate user.

#### Index Router:

- Sign up for an account.
- Log in to an account.

Endpoints

```python
    1. POST /sign-up
        Inputs: username, email, password, confirmPassword

    2.1 POST /log-in
            Inputs: username, password
    2.2 POST /api/guest-log-in

```

#### Users Router:

- Get all users.
- Get individual user.
- Update user profile.
- Get user's friends.
- Delete user's friend.

- Get user messages
- Create message
- Create reply

- Get group messages
- Create group
- Create group message

Endpoints

```python
    1. GET /users

    2. GET /users/userId
            Params: userId

    3. GET /users/userId/messages
            Params: userId

    4. GET /users/userId/messages/:messageId
            Params: userId

    5. POST /users/userId/messages
            Params: userId

    6. POST /users/userId/messages/:messageId
            Params: userId, messageId
            Inputs: text


    7. GET /users/userId/groups
            Params: userId

    8. GET /users/userId/groups/:groupId
            Params: userId, groupId

    9. POST /users/userId/groups/:groupId
            Params: userId
            Inputs: text

    10. POST /users/userId/groups
            Params: userId
            Inputs: groupName, members


```

## Tech Stack

- NodeJs
- Express
- PostgreSQL
- Supabase
- Socket.io
