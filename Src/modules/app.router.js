import connectDB from '../../DB/connection.js';
import categoriesRouter from './categories/categoies.router.js';
import productsRouter from './products/product.router.js';

const initApp = (app, express) => {
    app.use(express.json());
    connectDB();
    app.get('/', (req, res) => {
        return res.status(200).json({ message: "Welcome..." });
    })
    app.use('/categories', categoriesRouter);
    app.use('/products', productsRouter);
    app.get("*", (req, res) => {
        return res.status(200).json({ message: "Page Not Found!!" });
    })
}

export default initApp;