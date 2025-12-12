import { Router } from 'express';
import * as dockerController from '../controllers/docker.controller.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

router.get('/info', asyncHandler(dockerController.getDockerInfo));
router.get('/health', asyncHandler(dockerController.checkDockerHealth));

export default router;
