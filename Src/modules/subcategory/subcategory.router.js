import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import * as subcategoryContoller from './subcategory.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js'
import { asyncHandler } from '../../services/errorHandling.js'
import { endPoint } from './subcategory.endpoint.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './subcategory.validation.js';
const router = Router({ mergeParams: true });

router.post('/', asyncHandler(auth(endPoint.create)), fileUpload(fileValidation.image).single('image'),
    validation(validators.createSubCategory), asyncHandler(subcategoryContoller.createSubCategory));
router.get('/', asyncHandler(auth(endPoint.get)), validation(validators.getSubCategory),
    asyncHandler(subcategoryContoller.getSubCategory));
export default router;