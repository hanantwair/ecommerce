import subcategoryModel from '../../../DB/Model/SubCategory.model.js';
import categoryModel from '../../../DB/Model/Category.model.js';
import cloudinary from '../../services/cloudinary.js';
import slugify from 'slugify';

export const createSubCategory = async (req, res, next) => {
    const { name, categoryId } = req.body;
    const subcategory = await subcategoryModel.findOne({ name });
    if (subcategory) {
        return next(new Error(`sub category ${name} already exists`, { cause: 409 }));
    }
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error("category not found", { cause: 404 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/subcategories`
    });
    const subCategory = await subcategoryModel.create({ name, slug: slugify(name), categoryId, image: { secure_url, public_id } });
    return res.status(201).json({ message: "success", subCategory });
}

export const getSubCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error("Category Not Found", { cause: 404 }));
    }
    const subcategories = await subcategoryModel.find({ categoryId }).populate({ path: 'categoryId' });
    if (!subcategories) {
        return next(new Error("Sub-Categories Not Found", { cause: 404 }));
    }
    return res.status(200).json({ message: "sucesss", subcategories });
}