import { model, Schema } from "mongoose";

const bikeDetails = new Schema({
    name: {
        type: String,
        required: [true, "Please submit your Bike's name"],
    },
    model: {
        type: String,
        required: [true, "Please submit your Bike's model type"],
    },
    cargoSize: {
        type: String,
        enum: ["BASIC", "STANDARD", "LARGE"],
        default: "BASIC",
    },
    regNo: {
        type: Number,
        required: [true, "Please submit your Bike's registration number"],
    },
    pictures: {
        front: {
            type: String,
            required: [true, "Please submit the front view of your bike"],
            unique: true
        },
        right: {
            type: String,
            required: [true, "Please submit the right view of your bike"],
            unique: true
        },
        back: {
            type: String,
            required: [true, "Please submit the back view of your bike"],
            unique: true
        },
        left: {
            type: String,
            required: [true, "Please submit the left view of your bike"],
            unique: true
        },
    },
    color: {
        type: String,
        required: true
    }
});

const Bike = model('Bike', bikeDetails);

export default Bike;