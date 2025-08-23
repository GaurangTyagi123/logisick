import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import globalErrorController from './controllers/globalError.controller';
import passport from 'passport';
import oauthRouter from './routes/oauth.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(morgan('dev'));
app.use(helmet());

app.use('/api/v1/auth', authRouter);
app.use('/auth', oauthRouter);
app.use(globalErrorController);

export default app;
