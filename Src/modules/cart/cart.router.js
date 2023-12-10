import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { auth } from '../../middleware/auth.js';
import { endPoints } from './cart.endpoint.js';
import { asyncHandler } from '../../services/errorHandling.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './cart.validation.js';
const router = Router();

router.get('/', asyncHandler(auth(endPoints.get)), asyncHandler(cartController.getCart));
router.post('/', asyncHandler(auth(endPoints.create)), validation(validators.createCart),
    asyncHandler(cartController.createCart));
router.patch('/removeItem', asyncHandler(auth(endPoints.delete)), validation(validators.removeItem),
    asyncHandler(cartController.removeItem));
router.patch('/clearCart', asyncHandler(auth(endPoints.clear)), asyncHandler(cartController.clearCart));

export default router;