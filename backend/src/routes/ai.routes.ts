import { Router } from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { validateContainerId } from '../middlewares/security.middleware.js';
import {
  analyzeContainerLogs,
  getOptimizationSuggestions,
  naturalLanguageCommand,
  getCostAnalysis,
} from '../controllers/ai.controller.js';

const router = Router();

router.post('/analyze-logs/:id', validateContainerId, asyncHandler(analyzeContainerLogs));
router.get('/optimize/:id', validateContainerId, asyncHandler(getOptimizationSuggestions));
router.post('/natural-language', asyncHandler(naturalLanguageCommand));
router.get('/cost-analysis', asyncHandler(getCostAnalysis));

export default router;
