import express from 'express';
import { createClient } from 'redis';
import helmet from 'helmet'; // For security headers
import morgan from 'morgan'; // Only for development.
import cors from 'cors';
import cookieParser from 'cookie-parser';
import qs from 'qs';
import path from 'node:path';

// Api ROUTERS
import authRouter from './routes/auth.routes';
import orgRouter from './routes/org.routes';
import empRouter from './routes/emp.routes';

// Global Error Handler for requests
import globalErrorController from './controllers/globalError.controller';
import passport from 'passport';

// Open Authentication Routes
import oauthRouter from './routes/oauth.routes';
import userRouter from './routes/user.routes';
import itemRouter from './routes/item.routes';

// Initialize the application
const app = express();
const redisClient = createClient();

// Middleware for parsing json in request body
app.use(express.json());

// Middleware to parse the cookies sent with the request object
app.use(cookieParser());

// middleware to parse complex query strings
app.use(
    (
        req: ExpressTypes.Request,
        _res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
		req.parsedQuery = qs.parse(req._parsedUrl!.query || '');
        next();
    }
);

// Middleware to initialize Open Authentication
app.use(passport.initialize());

// Middleware which gives additional information about the requests comming to the server
app.use(morgan('dev'));
app.use(
    helmet({
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
    })
);

// Middleware to configure response to cross-origin requests
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Authentication router
app.use('/api/v1/auth', authRouter);
// Organzations router
app.use('/api/v1/org', orgRouter);
// Users router
app.use('/api/v1/users', userRouter);
// Employee router
app.use('/api/v1/emp', empRouter);
// Item Router
app.use('/api/v1/item',itemRouter)

// Open Authentication Routes
app.use('/auth', oauthRouter);

// Global Error Handler
app.use(globalErrorController);

// For production
if (process.env.NODE_ENV === 'production') {
    app.use(
        express.static(path.join(__dirname, '../../../frontend', 'dist-react'))
    );
    app.get('{*splat}', (_req, res) => {
        res.sendFile(
            path.join(
                __dirname,
                '../../../frontend',
                'dist-react',
                'index.html'
            )
        );
    });
}

export default app;
export { redisClient };
