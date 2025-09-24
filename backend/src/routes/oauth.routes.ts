import { Router } from 'express';
import passport from 'passport';
import googleSignup from '../controllers/oauth.controller';

const oauthRouter = Router();

// End-point to google email id selection screen
oauthRouter.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// End-point for handling user's google email id data
oauthRouter.get(
    '/google/redirect',
    passport.authenticate('google', { session: false }),
    googleSignup
);
export default oauthRouter;
