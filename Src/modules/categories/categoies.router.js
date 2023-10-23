import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
import fileUpload,{fileValidation} from '../../services/multer.js'
const router = Router();

router.get('/', categoriesContoller.getCategories);
router.post('/', fileUpload(fileValidation.image).single('image'), categoriesContoller.createCategory);

export default router;