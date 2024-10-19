# Store Management

    This project is a simple product management system using Node.js, Express, MongoDB, and Mongoose for the backend and React for the frontend.

## Getting Started

### Prerequisites

    Make sure you have the following installed:

    Node.js
    MongoDB
    Setup

#### Clone the repository:

    bash->> git clone <repository-url>

##### Install dependencies for both the server and client.

--> Navigate to the server directory and install dependencies:

    bash->> cd store
    npm install

-->Then navigate to the client directory and install dependencies:

    bash->> cd ../client
    npm install

Running the Application
Starting the Server
--> Navigate to the server directory:

    bash->> cd store

##### Start the server:

Using nodemon for automatic restarts:

    bash->> npm run server

Or simply using Node:

    bash->>npm start

The server will run on http://localhost:5008.

##### Starting the Client

Navigate to the client directory:

    bash->> cd ../client

Start the React application:

    bash->>npm start

The client will run on http://localhost:3000. The application will proxy API requests to the server running on port 5000.

Available Scripts
In the client directory, you can run:

npm start: Runs the app in development mode.
npm test: Launches the test runner in interactive watch mode.
npm run build: Builds the app for production.
npm run eject: Ejects the configuration for further customization.
In the server directory, you can run:

npm start: Starts the server.
npm run server: Starts the server with nodemon for automatic restarts.
npm run lint: Runs ESLint for code quality checks.
Environment Variables
