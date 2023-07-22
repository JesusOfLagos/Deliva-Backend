import { Schema, model } from "mongoose";
import { genSalt, hash } from 'bcrypt';


const authSchema = new Schema({
    who: {
        type: Schema.Types.UUID,
        required: true,
        ref: 'User',
        unique: true
    },
    secret: {
        type: String,
        minlength: [8, "Password length is too short"],
        required: [true, "Please provide a password"]
    }
}, { timestamps: true});


authSchema.pre('save', async function (next) {
    try {
        const salt = await genSalt();
        this.secret = await hash(this.secret, salt);
        next();
    } catch (error) {
        throw error;
    }
});


const Auth = model('Auth', authSchema);
export default Auth;