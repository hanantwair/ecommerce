import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
const router = Router();

router.get('/', categoriesContoller.getCategories);

export default router;