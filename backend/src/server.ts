import mongoose from 'mongoose';
import app, { redisClient } from './app';
import dotenv from 'dotenv';

// To configure path to the environment variables
dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT;

// Database connection url
const DB_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.DB_URL
        : process.env.DB_URL_DEV;

// con is the connection object to the database
mongoose
    .connect(DB_URL!, {
        serverSelectionTimeoutMS: 5000,
    })
    .then((con) => {
        if (con) console.log('SERVER : MongDB connection successfull');
        else console.log('SERVER : MongoDB connection failed');
    })
    .catch((_error) =>
        console.log('SERVER (ERROR) : error connecting to MongoDB')
    );
// redis connection
redisClient.on('connect', () => {
    console.log('SERVER : Redis connection successfull');
});

redisClient.on('error', () => {
    console.log('There was an error while connecting to redis server');
});
redisClient.on('reconnecting', () => {
    console.log('Reconnecting to redis');
});

redisClient.connect().catch((err) => {
    console.log(err.message);
});

// start the server
const server = app.listen(PORT, () => {
    console.log(`SERVER : Running at http://localhost:${PORT}`);
});

// For unhandled errors in synchronous code
process.on('uncaughtException', (err) => {
    console.log(err);
    console.log(
        'SERVER (ERROR) : uncaught exception encountered!!! 💥...application crashed!'
    );
    server.close(() => {
        process.exit();
    });
    mongoose.disconnect();
});
// For unhandled errors in async code
process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log(
        'SERVER (ERROR) : unhandled rejection encountered!!! 💥...application crashed!'
    );
    server.close(() => {
        process.exit();
    });
    mongoose.disconnect();
});
// When hosting service closes our application it triggers SIGTERM event
process.on('SIGTERM', () => {
    console.log('SERVER : SIGTERM recieved.... Closing server gracefully 😇');
    server.close(() => {
        process.exit();
    });
    mongoose.disconnect();
});

// when redis server shuts down it emits SIGINT event
process.on('SIGINT', async () => {
    console.log('SERVER: redis shutting down');
    await redisClient.quit();
    process.exit(0);
});
