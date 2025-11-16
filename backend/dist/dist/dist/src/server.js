"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importStar(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
// To configure path to the environment variables
dotenv_1.default.config({ path: 'config.env' });
const PORT = process.env.PORT;
// Database connection url
const DB_URL = process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : process.env.DB_URL_DEV;
// con is the connection object to the database
mongoose_1.default
    .connect(DB_URL, {
    serverSelectionTimeoutMS: 5000,
})
    .then((con) => {
    if (con)
        console.log('SERVER : MongDB connection successfull');
    else
        console.log('SERVER : MongoDB connection failed');
})
    .catch((_error) => console.log('SERVER (ERROR) : error connecting to MongoDB'));
// redis connection
app_1.redisClient.on('connect', () => {
    console.log('SERVER : Redis connection successfull');
});
app_1.redisClient.on('error', () => {
    console.log('There was an error while connecting to redis server');
});
app_1.redisClient.on('reconnecting', () => {
    console.log('Reconnecting to redis');
});
app_1.redisClient.connect().catch((err) => {
    console.log(err.message);
});
// start the server
const server = app_1.default.listen(PORT, () => {
    console.log(`SERVER : Running at http://localhost:${PORT}`);
});
// For unhandled errors in synchronous code
process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('SERVER (ERROR) : uncaught exception encountered!!! 💥...application crashed!');
    server.close(() => {
        process.exit();
    });
    mongoose_1.default.disconnect();
});
// For unhandled errors in async code
process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('SERVER (ERROR) : unhandled rejection encountered!!! 💥...application crashed!');
    server.close(() => {
        process.exit();
    });
    mongoose_1.default.disconnect();
});
// When hosting service closes our application it triggers SIGTERM event
process.on('SIGTERM', () => {
    console.log('SERVER : SIGTERM recieved.... Closing server gracefully 😇');
    server.close(() => {
        process.exit();
    });
    mongoose_1.default.disconnect();
});
// when redis server shuts down it emits SIGINT event
process.on('SIGINT', async () => {
    console.log('SERVER: redis shutting down');
    await app_1.redisClient.quit();
    process.exit(0);
});
