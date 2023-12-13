import jwt from 'jsonwebtoken';
import userModel from '../../DB/Model/User.model.js';

export const roles = {
    Admin: 'Admin',
    User: 'User',
}

export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return next(new Error("Invalid Authorization", { cause: 400 }));
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
        if (!decoded) {
            return next(new Error("Invalid Authorization", { cause: 400 }));
        }
        const user = await userModel.findById(decoded.id).select('userName role');
        if (!user) {
            return next(new Error("Not Registerd User", { cause: 404 }));
        }
        if (!accessRoles.includes(user.role)) {
            return next(new Error("Not Auth User", { cause: 403 }));
        }
        req.user = user;
        next();
    }
}