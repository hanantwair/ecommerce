import slugify from 'slugify';
import cloudinary from '../../services/cloudinary.js';
import categoryModel from '../../../DB/Model/Category.model.js';

export const getCategories = async (req, res, next) => {
    const categories = await categoryModel.find().populate('subcategory');
    if (!categories) {
        return next(new Error("Categories not Found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", categories });
}

export const getSpecificCategory = async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return next(new Error("Categories not Found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", category });
}


export const createCategory = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return next(new Error("Category Name Already Exists!", { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/categories`
    });
    const cat = await categoryModel.create({
        name, slug: slugify(name), image: { secure_url, public_id },
        createdBy: req.user._id, updatedBy: req.user._id
    });
    return res.status(201).json({ message: "success", cat });
}

export const updateCategory = async (req, res, next) => {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
        return next(new Error(`invalid category id ${req.params.id}`, { cause: 404 }));
    }
    if (req.body.name) {
        if (await categoryModel.findOne({ name: req.body.name }).select('name')) {
            return res.status(409).json({ message: `category ${req.body.name} alreqdy exists!` });
        }
        category.name = req.body.name;
        category.slug = slugify(req.body.name);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/categories`,
        });
        await cloudinary.uploader.destroy(category.image.public_id);
        category.image = { secure_url, public_id };
    }
    if (req.body.status) {
        category.status = req.body.status;
    }
    category.updatedBy = req.user._id;
    await category.save();
    return res.status(200).json({ message: "success", category });
}

export const getActiveCategory = async (req, res, next) => {
    const categories = await categoryModel.find({ status: 'Active' }).select('name image');
    if(!categories){
        return next(new Error("Active Categories not Found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", categories });
}