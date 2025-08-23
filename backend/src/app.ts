import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import globalErrorController from './controllers/globalError.controller';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));
app.use(helmet());

app.use('/api/v1/auth', authRouter);
app.use(globalErrorController);

export default app;
