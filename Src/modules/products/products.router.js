import { Router } from 'express';
import * as productsContoller from './products.controller.js';
import { endPoint } from './products.endpoint.js';
import { auth } from '../../middleware/auth.js';
import fileUpload, { fileValidation } from '../../services/multer.js';


const router = Router();

router.get('/', productsContoller.getProducts);
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 }
]), productsContoller.createProduct);

export default router;