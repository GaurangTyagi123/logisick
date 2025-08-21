import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './routes/authRoutes';
import globalErrorController from './controllers/globalErrorController';

const app = express();
app.use(express.json())
app.use(morgan('dev'));
app.use(helmet());

app.use('/api/v1/auth', authRouter);
app.use(globalErrorController);

export default app;
