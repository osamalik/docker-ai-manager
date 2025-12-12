import { Router } from 'express';
import * as containerController from '../controllers/container.controller.js';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validateContainerId, preventSelfTermination } from '../middlewares/security.middleware.js';

const router = Router();

router.get('/', asyncHandler(containerController.listContainers));
router.get('/:id/stats', validateContainerId, asyncHandler(containerController.getContainerStats));
router.get('/:id/logs', validateContainerId, asyncHandler(containerController.getContainerLogs));
router.get('/:id/inspect', validateContainerId, asyncHandler(containerController.inspectContainer));
router.post('/:id/start', validateContainerId, asyncHandler(containerController.startContainer));
router.post('/:id/stop', validateContainerId, preventSelfTermination, asyncHandler(containerController.stopContainer));
router.post('/:id/restart', validateContainerId, preventSelfTermination, asyncHandler(containerController.restartContainer));
router.post('/', asyncHandler(containerController.createContainer));
router.post('/bulk/stop', asyncHandler(containerController.bulkStopContainers));
router.post('/bulk/remove', asyncHandler(containerController.bulkRemoveContainers));
router.post('/prune', asyncHandler(containerController.pruneContainers));
router.delete('/:id', validateContainerId, preventSelfTermination, asyncHandler(containerController.removeContainer));

export default router;
