import express from "express";
import { createClient } from "redis";
import helmet from "helmet"; // For security headers
import morgan from "morgan"; // Only for development.
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";

// Api ROUTERS
import authRouter from "./routes/auth.routes";

// Global Error Handler for requests
import globalErrorController from "./controllers/globalError.controller";
import passport from "passport";

// Open Authentication Routes
import oauthRouter from "./routes/oauth.routes";
import userRouter from "./routes/user.routes";

// Initialize the application
const app = express();
const redisClient = createClient();



// Middleware for parsing json in request body
app.use(express.json());

// Middleware to parse the cookies sent with the request object
app.use(cookieParser());

// Middleware to initialize Open Authentication
app.use(passport.initialize());

// Middleware which gives additional information about the requests comming to the server
app.use(morgan("dev"));
app.use(helmet({ hidePoweredBy: true, noSniff: true, xssFilter: true }));

// Middleware to configure response to cross-origin requests
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

// Api routes
app.use("/api/v1/auth", authRouter);

// Open Authentication Routes
app.use("/auth", oauthRouter);
app.use("/api/v1/users", userRouter);

// Global Error Handler
app.use(globalErrorController);

app.use(express.static(path.join(__dirname, "../../frontend", "dist-react")));
if (process.env.NODE_ENV === "production") {
	console.log("produciton build");
	app.get("{*splat}", (req, res) => {
		res.sendFile(
			path.join(__dirname, "../../frontend", "dist-react", "index.html")
		);
	});
}

export default app;
export {redisClient}
