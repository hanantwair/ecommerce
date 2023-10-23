import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    usesrName: {
        type: String,
        required: true,
        min: 4,
        max: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    image: {
        type: Object,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive'],
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin'],
    },
}, {
    timestamps: true,
});

const userModel = mongoose.models.User || model('User', userSchema);

export default userModel;