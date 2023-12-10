import categoryModel from '../../../DB/Model/Category.model.js';
import subcategoryModel from '../../../DB/Model/SubCategory.model.js';
import productModel from '../../../DB/Model/Product.model.js';
import slugify from 'slugify';
import cloudinary from '../../services/cloudinary.js';


export const getProducts = (req, res, next) => {
    return res.json({ message: "products..." });
}

export const createProduct = async (req, res, next) => {
    const { name, price, discount, categoryId, subCategoryId } = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
        return next(new Error("Category not Found", { cause: 404 }));
    }
    const checkSubCategory = await subcategoryModel.findById(subCategoryId);
    if (!checkSubCategory) {
        return next(new Error("Sub-Category not Found", { cause: 404 }));
    }
    req.body.slug = slugify(name);
    req.body.finalPrice = price - (price * (discount || 0) / 100);

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,
        { folder: `${process.env.APP_NAME}/product/${req.body.name}/mainImage` });
    req.body.mainImage = { secure_url, public_id };

    req.body.subImages = [];
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` });
        req.body.subImages.push({ secure_url, public_id });
    }

    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const product = await productModel.create(req.body);
    if (!product) {
        return next(new Error("Error While Creating Product", { cause: 400 }));
    }
    product.save();

    return res.json({ message: "success", product });
}