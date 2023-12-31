import connectDB from '../../DB/connection.js';
import categoriesRouter from './categories/categoies.router.js';
import productsRouter from './products/products.router.js';
import authRouter from './auth/auth.router.js';
import subcategoryRouter from './subcategory/subcategory.router.js';
import couponRouter from './coupon/coupon.router.js';
import cartRouter from './cart/cart.router.js';
import cors from 'cors';
import { globalErrorHandler } from '../services/errorHandling.js';

const initApp = (app, express) => {
    app.use(cors());
    app.use(express.json());
    connectDB();
    app.get('/', (req, res) => {
        return res.status(200).json({ message: "Welcome..." });
    })
    app.use('/categories', categoriesRouter);
    app.use('/products', productsRouter);
    app.use('/auth', authRouter);
    app.use('/subcategory', subcategoryRouter);
    app.use('/coupon', couponRouter);
    app.use('/cart', cartRouter);
    app.get("*", (req, res) => {
        return next(new Error("Page Not Found!!", { cause: 500 }));
    });
    app.use(globalErrorHandler);
}

export default initApp;