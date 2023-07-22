import { Strategy as localStrategy } from 'passport-local';
import dotenv from 'dotenv';
dotenv.config();

import { switchProfile } from '../utils/globals/profileSwitch.js';
import USER from '../models/USER.js';
import RIDER from '../models/RIDER.js';

const passportConfig = (passport) => {

    // Serialize User
    passport.serializeUser(async (user, next) => {
        const userId = { id: user.id, role: user.role };
        next(null, userId);
    });

    // Deserialize User
    passport.deserializeUser(async (userId, next) => {
        try {
            const result = await User.findById(userId.id);
            next(null, result);
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    // Configure Local Strategy
    passport.use(
        new localStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true
            },
            async (req, email, password, next) => {
                try {
               const result = await switchProfile(req.params.role).Login(email, password);
                    next(null, result);
                } catch (error) {
                    console.log(error)
                    next(error, null);
                }
            }
        )
    );
}

export default passportConfig;