import couponModel from '../../../DB/Model/Coupon.model.js';

export const createCoupon = async (req, res, next) => {
    const { name, amount } = req.body;

    if (await couponModel.findOne({ name })) {
        return next(new Error("Coupon Name Already Exists", { cause: 409 }));
    }

    const coupon = await couponModel.create({ name, amount });
    return res.status(200).json({ message: "Success", coupon });
}

export const getCoupons = async (req, res, next) => {
    const coupons = await couponModel.find({});
    if (!coupons) {
        return next(new Error("Coupon not Found", { cause: 404 }));
    }
    return res.status(200).json({ message: "Success", coupons });
}

export const updateCoupon = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon) {
        return next(new Error("Coupon Name Already Exists", { cause: 404 }));
    }

    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error(`Coupon ${req.body.name} Already Exists`, { cause: 409 }));
        }
        coupon.name = req.body.name;
    }

    if (req.body.amount) {
        coupon.amount = req.body.amount;
    }
    await coupon.save();
    return res.status(200).json({ message: "success", coupon });
}

export const softDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: false },
        { isDeleted: true }, { new: true });

    if (!coupon) {
        return next(new Error("Can't Delete this Coupon", { cause: 400 }));
    }
    return res.status(200).json({ message: "Success", coupon });
}

export const hardDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id });

    if (!coupon) {
        return next(new Error("Can't Delete this Coupon", { cause: 400 }));
    }
    return res.status(200).json({ message: "Success", coupon });
}

export const restore = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: true },
        { isDeleted: false }, { new: true });

    if (!coupon) {
        return next(new Error("Can't Restore this Coupon", { cause: 400 }));
    }
    return res.status(200).json({ message: "Success", coupon });
}