import { Router } from 'express';
import * as productsContoller from './products.controller.js';

const router = Router();

router.get('/', productsContoller.getProducts);

export default router;