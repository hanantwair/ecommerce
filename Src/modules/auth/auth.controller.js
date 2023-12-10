import userModel from "../../../DB/Model/User.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from '../../services/cloudinary.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../services/email.js";
import { customAlphabet } from 'nanoid';

export const signup = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new Error("email already exsists", { cause: 409 }));
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/users`
    });
    const token = jwt.sign({ email }, process.env.CONFIRMEMAIL_SECRET);
    await sendEmail(email, "Confirm Email", `To  Verify Your Email <a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>Click Here</a>`);
    const createUser = await userModel.create({ userName, email, password: hashedPassword, image: { secure_url, public_id } });
    return res.status(201).json({ message: "success", createUser, token });
}

export const signin = async (req, res, next) => {
    const { email, password, } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("email not found", { cause: 409 }));
    }
    if (!user.confirmEmail) {
        return next(new Error("Plz Confirm Your Email!", { cause: 400 }));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return next(new Error("Data Invalid", { cause: 400 }));
    }

    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGIN_SECRET, { expiresIn: '60m' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGIN_SECRET, { expiresIn: 60 * 60 * 24 * 30 });
    return res.status(200).json({ message: "success", token, refreshToken });
}

export const confirmEmail = async (req, res, next) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.CONFIRMEMAIL_SECRET);
    if (!decoded) {
        return next(new Error("Invalid Token", { cause: 404 }));
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false },
        { confirmEmail: true });

    if (!user) {
        return next(new Error("Invalid verify your email or your email is verified", { cause: 400 }));
    }
    return res.redirect(process.env.LOGIN_FRONTEND);
}

export const sendCode = async (req, res, next) => {
    const { email } = req.body;
    let code = customAlphabet('1234567890abcdzABCDZ', 4);
    code = code();
    const user = await userModel.findOneAndUpdate({ email }, { sendCode: code }, { new: true });
    if (!user) {
        return next(new Error("email not found", { cause: 409 }));
    }
    const html = `<h2>Code is: ${code}</h2>`;
    await sendEmail(email, 'Reset Password', html);
    return res.redirect(process.env.FORGOT_PASSWORD);
}

export const forgotPassword = async (req, res, next) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("Not Register Account", { cause: 400 }));
    }
    if (user.sendCode != code) {
        return next(new Error("Invalid Code", { cause: 400 }));
    }
    let match = await bcrypt.compare(password, user.password);
    if (match) {
        return next(new Error("Same Password", { cause: 409 }));
    }
    user.password = await bcrypt.hash(password, parseInt(process.env.SALTROUND));

    user.sendCode = null;
    await user.save();
    return res.status(200).json({ message: "success" });
}

export const deleteInvalidConfirm = async (req, res, next) => {
    const users = await userModel.deleteMany({ confirmEmail: false });
    if (!users) {
        return next(new Error("users not found", { cause: 409 }));
    }
    return res.status(200).json({ message: "success" });
}