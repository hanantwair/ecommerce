import mongoose, { Schema, model, Types } from "mongoose";

const couponSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    usedBy: [{ type: Types.ObjectId, ref: 'User' }],
    expireDate: Date,
    createdBy: { type: Types.ObjectId, ref: 'User' },
    createdBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema);

export default couponModel;