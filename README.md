In Progress REST API
===========================

Overview
--------

This REST API is designed to manage what will be BJJ tours going forward (for now it has dummy data), offering endpoints to create, read, update, and delete both tours and user information. The project is built with Node.js, Express, and MongoDB.

Getting Started
---------------

### Prerequisites

-   Node.js
-   MongoDB

### Installation

1.  Clone the repository.
2.  Install the dependencies by running `npm install`.
3.  Create a `.env` file in the root directory and set up your database connection string.
4.  Start the server by running `npm start`.

Directory Structure
-------------------

```plaintext
`restAPI/
┣ controllers/
┣ dev-data/
┣ models/
┣ node_modules/
┣ public/
┣ routes/
┣ .eslintrc.json
┣ .gitignore
┣ .prettierrc
┣ app.js
┣ config.env
┣ package-lock.json
┣ package.json
┗ server.js`
```

API Endpoints
-------------

### Tours

-   GET `/api/v1/tours`: Fetch all tours.
-   GET `/api/v1/tours/:id`: Fetch a specific tour by ID.
-   POST `/api/v1/tours`: Create a new tour.
-   PATCH `/api/v1/tours/:id`: Update a tour by ID.
-   DELETE `/api/v1/tours/:id`: Delete a tour by ID.

### Users

-   GET `/api/v1/users`: Fetch all users (Not implemented yet).
-   GET `/api/v1/users/:id`: Fetch a specific user by ID (Not implemented yet).
-   POST `/api/v1/users`: Create a new user (Not implemented yet).
-   PATCH `/api/v1/users/:id`: Update a user by ID (Not implemented yet).
-   DELETE `/api/v1/users/:id`: Delete a user by ID (Not implemented yet).

Models
------

### Tour

The `Tour` model includes fields such as:

-   `name`: String, required
-   `duration`: Number, required
-   `maxGroupSize`: Number, required
-   `difficulty`: String, required
-   `price`: Number, required
-   `ratingsAverage`: Number
-   `images`: Array of Strings
-   (Other fields as defined in the schema)

Middleware
----------

The application uses middleware for logging (in development mode), parsing JSON requests, serving static files, and adding request time.

Deployment
----------

Make sure to set the `NODE_ENV` variable and configure the database connection string accordingly in the production environment.

* * * * *

Feel free to edit or add any additional details as needed. If you have any more questions or need further assistance, please don't hesitate to ask!
