import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { auth } from '../../middleware/auth.js';
import { endPoints } from './cart.endpoint.js';
const router = Router();

router.get('/', auth(endPoints.get), cartController.getCart);
router.post('/', auth(endPoints.create), cartController.createCart);
router.patch('/removeItem', auth(endPoints.delete), cartController.removeItem);
router.patch('/clearCart', auth(endPoints.clear), cartController.clearCart);

export default router;