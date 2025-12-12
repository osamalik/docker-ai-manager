import { Router } from 'express';
import * as imageController from '../controllers/image.controller.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

router.get('/', asyncHandler(imageController.listImages));
router.post('/prune', asyncHandler(imageController.pruneImages));

export default router;
