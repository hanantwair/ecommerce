import userModel from "../../../DB/Model/User.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from '../../services/cloudinary.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../services/email.js";
import { customAlphabet } from 'nanoid';

export const signup = async (req, res) => {
    const { userName, email, password, } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(409).json({ message: "email already exsists" });
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

export const signin = async (req, res) => {
    const { email, password, } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(409).json({ message: "email not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Data Invalid" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGIN_SECRET, { expiresIn: '60m' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGIN_SECRET, { expiresIn: 60 * 60 * 24 * 30 });
    return res.status(200).json({ message: "success", token, refreshToken });
}

export const confirmEmail = async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.CONFIRMEMAIL_SECRET);
    if (!decoded) {
        return res.status(404).json({ message: "Invalid Token" });
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false },
        { confirmEmail: true });

    if (!user) {
        return res.status(400).json({ message: "Invalid verify your email or your email is verified" });
    }
    return res.redirect(process.env.LOGIN_FRONTEND);
}


export const sendCode = async (req, res) => {
    const { email } = req.body;
    let code = customAlphabet('1234567890abcdzABCDZ', 4);
    code = code();
    const user = await userModel.findOneAndUpdate({ email }, { sendCode: code }, { new: true });
    if (!user) {
        return res.status(409).json({ message: "email not found" });
    }
    const html = `<h2>Code is: ${code}</h2>`;
    await sendEmail(email, 'Reset Password', html);
    return res.redirect(process.env.FORGOT_PASSWORD);
}

export const forgotPassword = async (req, res) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Not Register Account" });
    }
    if (user.sendCode != code) {
        return res.status(400).json({ message: "Invalid Code" });
    }
    let match = await bcrypt.compare(password, user.password);
    if (match) {
        return res.status(409).json({ message: "Same Password" });
    }
    user.password = await bcrypt.hash(password, parseInt(process.env.SALTROUND));

    user.sendCode = null;
    await user.save();
    return res.status(200).json({ message: "success" });
}