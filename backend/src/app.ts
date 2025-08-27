import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import globalErrorController from "./controllers/globalError.controller";
import passport from "passport";
import oauthRouter from "./routes/oauth.routes";
import userRouter from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(morgan("dev"));
app.use(helmet({ hidePoweredBy: true, noSniff: true, xssFilter: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// app.use(
// 	(
// 		req: ExpressTypes.Request,
// 		res: ExpressTypes.Response,
// 		next: ExpressTypes.NextFn
// 	) => {
// 		console.log(req.cookies);
// 		next();
// 	}
// );

app.use("/api/v1/auth", authRouter);
app.use("/auth", oauthRouter);
app.use("/api/v1/users", userRouter);
app.use(globalErrorController);

export default app;
