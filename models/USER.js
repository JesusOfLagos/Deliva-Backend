import { Schema, model } from 'mongoose';
import Auth from './AUTH.js';
import bcrypt from 'bcrypt';
import pkg from 'validator';
const { isEmail } = pkg;
import { randomUUID } from 'crypto';


// User Model
const userSchema = new Schema({
    _id: {
        type: Schema.Types.UUID,
        default: () => randomUUID()
    },
    email: {
        type: String,
        required: [true, "An email is required for registration"],
        unique: [true, "Email already in use"],
        lowercase: true,
        validate: [isEmail, "Please provide a valid email address"]
    },
    verified: {
        type: Boolean,
        default: false,
        select: false,
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
}, { timestamps: true });

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.statics.CreateAccount = async function (email, password) {
    console.log(email, password)
    try {
        const newUser = await this.create({ email });
        await Auth.create({ who: newUser._id, secret: password });
        return newUser;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.Login = async function (email, password) {   
    try {
        const foundUser = await this.findOne({ email });
        const userAuth = await Auth.findOne({ who: foundUser._id }, {secret: 1});
        const isValid =  await bcrypt.compare(password, userAuth.secret);
        if (isValid) {
            return foundUser;
        }
        throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
}

userSchema.statics.RecoverPassword = async function (email) {
    try {
        console.log(email)
        const isAvailable = await this.findOne({ email }).select('+authType');
        console.log(isAvailable);
        if (isAvailable != null) {
            console.log(isAvailable.authType)
            if (isAvailable.authType != "PASSWORD") {
                throw Error('No password required');
            } else {
                const passwordHash = await Auth.findOne({ who: isAvailable._id });
                const resetId = createToken(isAvailable, passwordHash.secret);
                const resetLink = `http://${process.env.HOST}:${process.env.PORT}/api/v1/auth/reset/password/${resetId}`;
                console.log(resetLink);
                return resetLink
            }
        }
    } catch (error) {
        throw error
    }
}

userSchema.statics.ResetPassword = async function (id, oldPassword, newPassword) {
    try {
        const updatedUser = await Auth.findOne({ who: id });
        console.log('compare', updatedUser.secret, oldPassword)
        if (updatedUser.secret == oldPassword) {
            updatedUser.secret = newPassword;
            const result = await updatedUser.save();
            console.log('success', result)
            return "updated"
        }
        throw Error('Password was changed recently')
    } catch (error) {
        throw error
    }
}


const USER = model('User', userSchema);

export default USER;
