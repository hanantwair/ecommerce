import couponModel from '../../../DB/Model/Coupon.model.js';

export const createCoupon = async (req, res) => {
    const { name, amount } = req.body;

    if (await couponModel.findOne({ name })) {
        return res.status(409).json({ message: "Coupon Name Already Exists" });
    }

    const coupon = await couponModel.create({ name, amount });
    return res.status(200).json({ message: "Success", coupon });
}

export const getCoupons = async (req, res) => {
    const coupons = await couponModel.find({});
    return res.status(200).json({ message: "Success", coupons });
}

export const updateCoupon = async (req, res) => {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon) {
        return res.status(404).json({ message: "Coupon not Found" });
    }

    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name })) {
            return res.status(409).json({ message: `Coupon ${req.body.name} Already Exists` });
        }
        coupon.name = req.body.name;
    }

    if (req.body.amount) {
        coupon.amount = req.body.amount;
    }
    await coupon.save();
    return res.status(200).json({ message: "success", coupon });
}

export const softDelete = async (req, res) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: false },
        { isDeleted: true }, { new: true });

    if (!coupon) {
        return res.status(400).json({ message: "Can't Delete this Coupon" });
    }
    return res.status(200).json({ message: "Success", coupon });
}

export const hardDelete = async (req, res) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id });

    if (!coupon) {
        return res.status(400).json({ message: "Can't Delete this Coupon" });
    }
    return res.status(200).json({ message: "Success", coupon });
}

export const restore = async (req, res) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: true },
        { isDeleted: false }, { new: true });

    if (!coupon) {
        return res.status(400).json({ message: "Can't Restore this Coupon" });
    }
    return res.status(200).json({ message: "Success", coupon });
}