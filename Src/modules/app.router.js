import connectDB from '../../DB/connection.js';
import categoriesRouter from './categories/categoies.router.js';
import productsRouter from './products/products.router.js';
import authRouter from './auth/auth.router.js';
import subcategoryRouter from './subcategory/subcategory.router.js';
import couponRouter from './coupon/coupon.router.js';

const initApp = (app, express) => {
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
    app.get("*", (req, res) => {
        return res.status(200).json({ message: "Page Not Found!!" });
    });
}

export default initApp;