import passport from 'passport';
import GoogleStrategy, { type StrategyOptions } from 'passport-google-oauth2';
import User from '../models/user.model';

// passport.serializeUser((user: OAuthUser, done) => {
//     done(null, user.user?._id);
// });
// passport.deserializeUser(async (id, done) => {
//     const user = await User.findById(id);
//     done(null, user);
// });
passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            callbackURL: process.env.OAUTH_CALLBACK_URL ,
        } as StrategyOptions,
        async (_, refreshToken, profile, done) => {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile._json.email,
                    isVerified: true,
                    refreshToken,
                });
                done(null, newUser);
            }
        }
    )
);
