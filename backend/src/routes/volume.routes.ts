import { Router } from 'express';
import * as volumeController from '../controllers/volume.controller.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

router.get('/', asyncHandler(volumeController.listVolumes));
router.post('/', asyncHandler(volumeController.createVolume));
router.delete('/:name', asyncHandler(volumeController.removeVolume));
router.post('/prune', asyncHandler(volumeController.pruneVolumes));

export default router;
