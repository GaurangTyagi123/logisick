import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

// To configure path to the environment variables
// To configure path to the environment variables
dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT;

// Database connection url

// Database connection url
const DB_URL = process.env.DB_URL;

// con is the connection object to the database
// con is the connection object to the database
mongoose.connect(DB_URL!).then((con) => {
    if (con) console.log('Connection successfull');
    else console.log('Connection failed');
});

// start the server
const server = app.listen(PORT, () => {
// start the server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// For unhandled errors in synchronous code
process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('uncaught exception encountered!!! 💥...application crashed!');
    server.close();
});
// For unhandled errors in async code
process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('unhandled rejection encountered!!! 💥...application crashed!');
    server.close();
});
// When hosting service closes our application it triggers SIGTERM event
process.on('SIGTERM', () => {
    console.log('SIGTERM recieved.... Closing server gracefully 😇');
    server.close();
});