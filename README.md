# Anonify

![Preview](preview.png)

## Overview

Anonify is a full stack application for anonymous messaging. It was created using Node.js, Express.js and MongoDB. This project is currently deployed and hosted on a cloud platform called Render as a demo site.

- [**See Live**](https://anonify.onrender.com) (Note: Render can take up to **1 minute to "wake up"** web services)

- **Features**
  - Visitors without an account:
    - Can view the existing content
    - Cannot see the timestamps and the authors
    - Cannot create posts
  - Regular users without any membership status:
    - Can create and view posts
    - Cannot see the timestamps and the authors
  - Users who have a valid membership code:
    - Can see the timestamps and the authors
  - Users who have a valid moderation code:
    - Can see the timestamps and the authors
    - Can delete messages

## Installation

Make sure you have Node.js version >= 14.7.3 installed. Either use your OS's package manager or follow the instructions [here](https://nodejs.org/en/). This project uses MongoDB as its database. If you don't have it installed or not sure how to make the connection follow [these instructions](https://docs.mongodb.com/manual/installation/#mongodb-community-edition). Then, manually download this repository or clone it by running the command below.

```
$ git clone https://github.com/feyzanaydemir/anonify.git
```

- Change into the `/anonify` directory and install the requirements.

  ```
  $ cd anonfiy
  $ npm install
  ```

  To start the application and access it at `http://localhost:8080`, run:

  ```
  $ node app.js
  ```

### Enviroment Variables

```
DB_URI=
SECRET=
MEMBERSHIP=
MODERATOR=
```
