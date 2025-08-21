import express from 'express';
import helmet from 'helmet';
import morgan from "morgan"

const app = express();
app.use(morgan("dve"))
app.use(helmet());

export default app;
