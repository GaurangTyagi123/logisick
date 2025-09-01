import { Router } from 'express';
import passport from 'passport';
import googleSignup from '../controllers/oauth.controller';

const oauthRouter = Router();

// end-point to google email id selection screen
oauthRouter.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// end-point for handling user's google email id data
oauthRouter.get(
    '/google/redirect',
    passport.authenticate('google', { session: false }),
    googleSignup
);
export default oauthRouter;
