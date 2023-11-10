import slugify from 'slugify';
import cloudinary from '../../services/cloudinary.js';
import categoryModel from '../../../DB/Model/Category.model.js';

export const getCategories = async (req, res) => {
    const categories = await categoryModel.find().populate('subcategory');
    return res.status(200).json({ message: "success", categories });
}

export const getSpecificCategory = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    return res.status(200).json({ message: "success", category });
}


export const createCategory = async (req, res) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return res.status(409).json({ message: "Category Name Already Exists!" });
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

export const updateCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: `invalid category id ${req.params.id}` });
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
    } catch (err) {
        return res.status(500).json({ message: "error", err });
    }
}

export const getActiveCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({ status: 'Active' }).select('name image');
        return res.status(200).json({ message: "success", categories });
    } catch (err) {
        return res.status(500).json({ message: "error", err });
    }
}