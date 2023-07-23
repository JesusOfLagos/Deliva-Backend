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
        required: [true, "First Name is required."],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required."],
    },
    email: {
        type: String,
        required: [true, "An email address is required."],
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
    role: {
        type: String,
        default: 'rider',
        required: true
    },
    base: {
        type: { type: String },
        coordinates: [Number],
    },
    contact: {
        type: String,
    }
}, { timestamps: true });

riderSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

riderSchema.statics.CreateAccount = async function (email, password, firstName = undefined, lastName = undefined) {
    console.log("fd", email, password, firstName, lastName)
    try {
        const newUser = await this.create({ email, firstName, lastName });
        const createdPassword = await Auth.create({ who: newUser._id, secret: password });
        return newUser;
    } catch (error) {
        throw error;
    }
};

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