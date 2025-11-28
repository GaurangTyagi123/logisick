import passport from "passport";
import GoogleStrategy, { type StrategyOptions } from "passport-google-oauth2";
import User from "../models/user.model";
import { genProfileString } from "./avatarGen";

// .PASSPORT MIDDLEWARE

passport.use(
	// initialize the googleStrategy (open authentication of google)
	/**
	 * @params clientID, clientSecret, callBackURL (all these params are provided by Google)
	 * @sideffect User data is stored in the database
	 * @approach Check if the user already exists in the database then pass the existing user's data to done
	 * 			else store new user's data into the database and pass the data to done
	 */
	// done takes to arguments:
	// 1.) Any error 2.) Data
	new GoogleStrategy.Strategy(
		{
			clientID: process.env.OAUTH_CLIENT_ID,
			clientSecret: process.env.OAUTH_CLIENT_SECRET,
			callbackURL: process.env.OAUTH_CALLBACK_URL,
		} as StrategyOptions,
		async (_, refreshToken, profile, done) => {
			// profile is an object sent by google upon successfull authentication which contains user's google profile data
			const user = await User.findOne({ googleId: profile.id });
			if (user) {
				done(null, user); // done passes the user data to the next middleware
			} else {
				const newUser = await User.create({
					googleId: profile.id,
					name: profile.displayName,
					email: profile._json.email,
					isVerified: true,
					avatar: genProfileString(12),
				});
				done(null, newUser);
			}
		}
	)
);
