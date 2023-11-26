import categoryModel from '../../../DB/Model/Category.model.js';
import subcategoryModel from '../../../DB/Model/SubCategory.model.js';
import productModel from '../../../DB/Model/Product.model.js';
import slugify from 'slugify';
import cloudinary from '../../services/cloudinary.js';


export const getProducts = (req, res) => {
    return res.json({ message: "products..." });
}

export const createProduct = async (req, res) => {
    const { name, price, discount, categoryId, subCategoryId } = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
        return res.status(400).json({ message: "Category Not Found" });
    }
    const checkSubCategory = await subcategoryModel.findById(subCategoryId);
    if (!checkSubCategory) {
        return res.status(400).json({ message: "Sub Category Not Found" });
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
        return res.status(400).json({ message: "Error While Creating Product" });
    }
    product.save();

    return res.json({ message: "success", product });
}