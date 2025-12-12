import { Router } from 'express';
import containerRoutes from './container.routes.js';
import imageRoutes from './image.routes.js';
import dockerRoutes from './docker.routes.js';
import networkRoutes from './network.routes.js';
import volumeRoutes from './volume.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Docker Node Controller API is running',
        timestamp: new Date().toISOString()
    });
});

router.use('/containers', containerRoutes);
router.use('/images', imageRoutes);
router.use('/networks', networkRoutes);
router.use('/volumes', volumeRoutes);
router.use('/docker', dockerRoutes);
router.use('/ai', aiRoutes);

export default router;
