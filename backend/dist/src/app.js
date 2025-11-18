"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const helmet_1 = __importDefault(require("helmet")); // For security headers
const morgan_1 = __importDefault(require("morgan")); // Only for development.
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const qs_1 = __importDefault(require("qs"));
const node_path_1 = __importDefault(require("node:path"));
// Api ROUTERS
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const org_routes_1 = __importDefault(require("./routes/org.routes"));
const emp_routes_1 = __importDefault(require("./routes/emp.routes"));
// Global Error Handler for requests
const globalError_controller_1 = __importDefault(require("./controllers/globalError.controller"));
const passport_1 = __importDefault(require("passport"));
// Open Authentication Routes
const oauth_routes_1 = __importDefault(require("./routes/oauth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const shipment_routes_1 = require("./routes/shipment.routes");
// Initialize the application
const app = (0, express_1.default)();
// redis connection configuration for development environment
const devOptions = {
    socket: {
        reconnectStrategy(times) {
            if (times > 3) {
                return new Error('Retries exhausted');
            }
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    },
};
// redis connection configuration for production environment
const prodOptions = {
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        reconnectStrategy(times) {
            if (times > 3) {
                return new Error('Retries exhausted');
            }
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    },
};
const socketOptions = process.env.NODE_ENV === 'production' ? prodOptions : devOptions;
// create redis client
const redisClient = (0, redis_1.createClient)(socketOptions);
exports.redisClient = redisClient;
// Middleware for parsing json in request body
app.use(express_1.default.json());
// Middleware to parse the cookies sent with the request object
app.use((0, cookie_parser_1.default)());
// middleware to parse complex query strings
app.use((req, _res, next) => {
    req.parsedQuery = qs_1.default.parse(req._parsedUrl.query || '');
    next();
});
// Middleware to initialize Open Authentication
app.use(passport_1.default.initialize());
// Middleware which gives additional information about the requests comming to the server
app.use("/api", (0, morgan_1.default)('tiny'));
app.use((0, helmet_1.default)({
    hidePoweredBy: true,
    noSniff: true,
    xssFilter: true,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            workerSrc: ["'self'", 'blob:'],
            childSrc: ["'self'", 'blob:'],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                process.env.NODE_ENV === 'development'
                    ? "'unsafe-eval'"
                    : 'https://storage.googleapis.com',
            ],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            manifestSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            fontSrc: ["'self'", 'https:', 'data:'],
        },
    },
}));
// Middleware to configure response to cross-origin requests
if (process.env.NODE_ENV === 'production') {
    app.use((0, cors_1.default)({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }));
    app.options('/api/v1/', (0, cors_1.default)({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }));
}
else {
    app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
    app.options('/api/v1/', (0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
}
// Authentication router
app.use('/api/v1/auth', auth_routes_1.default);
// Organzations router
app.use('/api/v1/org', org_routes_1.default);
// Users router
app.use('/api/v1/users', user_routes_1.default);
// Employee router
app.use('/api/v1/emp', emp_routes_1.default);
// Item Router
app.use('/api/v1/item', item_routes_1.default);
app.use('/api/v1/order', shipment_routes_1.shipmentRouter);
// Open Authentication Routes
app.use('/auth', oauth_routes_1.default);
// Global Error Handler
app.use(globalError_controller_1.default);
// For production
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(node_path_1.default.join(__dirname, '../../../frontend', 'dist-react')));
    app.get('{*splat}', (_req, res) => {
        res.sendFile(node_path_1.default.join(__dirname, '../../../frontend', 'dist-react', 'index.html'));
    });
}
exports.default = app;
