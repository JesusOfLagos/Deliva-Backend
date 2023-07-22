import { model, Schema } from "mongoose";
import Auth from './AUTH.js';
import bcrypt from 'bcrypt';
import pkg from 'validator';
const { isEmail } = pkg;
import { randomUUID } from 'crypto';

const riderSchema = new Schema({
    _id: {
        type: Schema.Types.UUID,
        default: () => randomUUID()
    },
    firstName: {
        type: String,
        required: [true, "First Name is required for registration."],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required for registration."],
    },
    email: {
        type: String,
        required: [true, "An email address is required for registration"],
        unique: [true, "There's an email account with this email"]
    },
    authType: {
        type: String,
        enum: ["GOOGLE", "FACEBOOK", "EMAIL"],
        required: [true, "No valid authentication method was supplied"],
        default: "EMAIL"
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

riderSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

riderSchema.statics.CreateAccount = async function (email, password) {
    console.log(email, password)
    try {
        const newUser = await this.create({ email });
        const createdPassword = await Auth.create({ who: newUser._id, secret: password });
        return newUser;
    } catch (error) {
        throw error;
    }
}

riderSchema.statics.Login = async function (email, password) {
    try {
        const foundUser = await this.findOne({ email });
        const secretPlace = await Auth.findOne({ who: foundUser._id });
        console.log("to be compared", password, secretPlace)
        const isValid = await bcrypt.compare(password, secretPlace.secret);
        if (isValid) {
            return foundUser;
        }
        throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
}

const RIDER = model('RIDER', riderSchema);

export default RIDER;