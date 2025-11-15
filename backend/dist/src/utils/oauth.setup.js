"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const user_model_1 = __importDefault(require("../models/user.model"));
// .PASSPORT MIDDLEWARE
passport_1.default.use(
// initialize the googleStrategy (open authentication of google)
/**
 * @params clientID, clientSecret, callBackURL (all these params are provided by Google)
 * @sideffect User data is stored in the database
 * @approach Check if the user already exists in the database then pass the existing user's data to done
 * 			else store new user's data into the database and pass the data to done
 */
// done takes to arguments:
// 1.) Any error 2.) Data
new passport_google_oauth2_1.default.Strategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL,
}, async (_, refreshToken, profile, done) => {
    const user = await user_model_1.default.findOne({ googleId: profile.id });
    if (user) {
        done(null, user); // done passes the user data to the next middleware
    }
    else {
        const newUser = await user_model_1.default.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile._json.email,
            isVerified: true,
        });
        done(null, newUser);
    }
}));
