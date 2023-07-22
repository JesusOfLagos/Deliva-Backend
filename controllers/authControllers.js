import passport from "passport";
import asyncTryCatch from "../utils/globals/tryCatchAllFn.js";
import AppError from "../utils/globals/customError.js";
import errorHandler from "../utils/errorHandlers/authError.js";
import USER from "../models/USER.js";
import RIDER from "../models/RIDER.js";
import { switchProfile } from "../utils/globals/profileSwitch.js";

export const register_post = asyncTryCatch(async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    console.log(req.params.role);
    if (password?.length >= 8) {
        try {
            const newUser = await switchProfile(req.params.role).CreateAccount(
                email,
                password,
                firstName,
                lastName);
            if (newUser) {
                // setting up passport serializer
                req.login(newUser, (err) => {
                    console.log('We are in');
                    if (err) {
                        console.error(err);
                        console.log('but theres a problem');
                        return next(err);
                    }
                });
                res.status(201).json({ success: { message: "Account created succesfully!", data: newUser } })
            }
        } catch (error) {
            console.log(error)
            next(new AppError(errorHandler(error), 400));
        }
    } else {
        next(new AppError('Password length is too short!', 400));
    }
});

export const logout_post = asyncTryCatch(async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        console.log('nigga just logged out');
        // what's the appropriate code for loggin out?
        res.status(200).json({ success: { message: "Logged out successfully" } })
    });
});

export const local_scope = (req, res, next) => {
    passport.authenticate('local')(req, res, next);
};


export const google_scope = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
};

export const sign_in_with_google = (req, res, next) => {
    passport.authenticate('google')(req, res, next);
};

export const forgot_password = (req, res) => {
    res.render('forgot-password');
};

export const smart_redirect = (req, res) => {
    const url = (req.session.returnTo || "/dashboard");
    console.log(req.user);
    res.json({ redirect: url, data: req.user });
};

export const smart_redirect_google = (req, res) => {
    const url = (req.session.returnTo || "/dashboard");
    res.redirect(url);
};

export const recover_password = asyncTryCatch(async (req, res) => {
    console.log(req.body.email);
    if (req.body.email) {
        try {
            const result = await switchProfile(req.body.role).RecoverPassword(req.body.email);
            res.status(200).json({ status: "success", data: result })
        } catch (error) {
            console.log("df", error);
            res.status(400).json({ error: error.message })
        }
    } else {
        res.status(400).json({ error: "Please supply a Valid email address" })
    }
});


export const reset_password_get = (req, res) => {
    const resetId = req.params.resetId;
    res.status(200).json({ token: resetId });
}

export const reset_password_post = asyncTryCatch(async (req, res) => {
    console.log(req.body);
    try {
        const { email, id, role, key } = verifyToken(req.body.token);
        console.log('decoded ', email, id, role);
        if (req.body.email != email) {
            res.status(400).json({ error: "Incorrect Details Supplied" });
        } else if (req.body.password?.length >= 8) {
            result = await switchProfile(role).ResetPassword(id, key, req.body.password);
            if (result === 'updated') {
                res.status(200).json({ status: "success", data: 'Password updated successfully' })
            }
        } else {
            res.status(400).json({ status: "error", message: "Password length is too short" })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: "error", message: error.message })
    }
});