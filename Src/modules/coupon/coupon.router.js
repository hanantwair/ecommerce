import { Router } from 'express';
import * as couponController from './coupon.controller.js';
import { auth } from '../../middleware/auth.js';
import { asyncHandler } from '../../services/errorHandling.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './coupon.validation.js';
import { endPoint } from './coupon.endpoint.js';
const router = Router();

router.post('/', asyncHandler(auth(endPoint.create)), validation(validators.createCoupon),
    asyncHandler(couponController.createCoupon));
router.get('/', asyncHandler(auth(endPoint.get)), asyncHandler(couponController.getCoupons));
router.put('/:id', asyncHandler(auth(endPoint.update)), validation(validators.updateCoupon),
    asyncHandler(couponController.updateCoupon));
router.patch('/softDelete/:id', asyncHandler(auth(endPoint.delete)), validation(validators.softDelete),
    asyncHandler(couponController.check_id));
router.delete('/hardDelete/:id', asyncHandler(auth(endPoint.delete)), validation(validators.hardDelete),
    asyncHandler(couponController.check_id));
router.patch('/restore/:id', asyncHandler(auth(endPoint.restore)), validation(validators.restore),
    asyncHandler(couponController.check_id));

export default router;