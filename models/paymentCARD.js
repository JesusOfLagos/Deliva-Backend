import { Schema, Model } from 'mongoose';
import pkg from 'validator';


const paymentCardSchema = new Schema({
    userId: {
        type: Schema.Types.UUID,
        required: [true, "Please supply the Account associated with this Card"],
        unique: [true, "This card has already been connect to an account"],
    },
    provider: {
        type: String,
        enum: ["MasterCard", "Visa", "Verve"],
        required: true,
    },
    cardNumber: {
        type: Number,
        required: [true, "Please supply a valid Card Number"],

    },
    cardCvv: {
        type: Number,
        required: [true, "Please supply the correct card cvv"],
        maxLength: 3,
    },
}, { timestamps: true, _id: false });



CardDetails = Model('UserCardDetails', paymentCardSchema);

export default CardDetails;