import jwt from 'jsonwebtoken';
import userModel from '../../DB/Model/User.model.js';

export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return res.status(400).json({ message: "Invalid Authorization" });
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "Invalid Authorization" });
        }
        const user = await userModel.findById(decoded.id).select('userName role');
        if (!user) {
            return res.status(404).json({ message: "Not Registerd User" });
        }
        if (!accessRoles.includes(user.role)) {
            return res.status(403).json({ message: "Not Auth User" });
        }
        req.user = user;
        next();
    }
}