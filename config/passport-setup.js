import { Strategy as localStrategy } from 'passport-local';
import dotenv from 'dotenv';
dotenv.config();

import { switchProfile } from '../utils/globals/profileSwitch.js';


const passportConfig = (passport) => {

    // Serialize User
    passport.serializeUser(async (user, next) => {
        const userId = { id: user.id, role: user.role };
        next(null, userId);
    });

    // Deserialize User
    passport.deserializeUser(async (user, next) => {
        try {
            const result = await switchProfile(user.role).findById(user.id);
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