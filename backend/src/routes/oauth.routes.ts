import { Router } from 'express';
import passport from 'passport';
import googleSignup from '../controllers/oauth.controller';

const oauthRouter = Router();

oauthRouter.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);
oauthRouter.get(
    '/google/redirect',
    passport.authenticate('google', { session: false }),
    googleSignup
);
export default oauthRouter;
