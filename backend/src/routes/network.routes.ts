import { Router } from 'express';
import * as networkController from '../controllers/network.controller.js';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validateContainerId } from '../middlewares/security.middleware.js';

const router = Router();

router.get('/', asyncHandler(networkController.listNetworks));
router.post('/', asyncHandler(networkController.createNetwork));
router.delete('/:id', validateContainerId, asyncHandler(networkController.removeNetwork));

export default router;
