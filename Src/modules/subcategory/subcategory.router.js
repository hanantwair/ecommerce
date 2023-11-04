import { Router } from 'express';
import * as subcategoryContoller from './subcategory.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js'
const router = Router({ mergeParams: true });

router.post('/', fileUpload(fileValidation.image).single('image'), subcategoryContoller.createSubCategory);
router.get('/', subcategoryContoller.getSubCategories);

export default router;