import { Request, Response } from 'express';
import dockerService from '../services/docker.service.js';

export const listImages = async (_req: Request, res: Response): Promise<void> => {
    const images = await dockerService.listImages();
    
    res.status(200).json({
        success: true,
        count: images.length,
        data: images
    });
};

export const pruneImages = async (_req: Request, res: Response): Promise<void> => {
    const result = await dockerService.pruneImages();
    
    res.status(200).json({
        success: true,
        message: 'Unused images pruned successfully',
        data: result
    });
};
