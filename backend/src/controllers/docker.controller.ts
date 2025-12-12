import { Request, Response } from 'express';
import dockerService from '../services/docker.service.js';

export const getDockerInfo = async (_req: Request, res: Response): Promise<void> => {
    const info = await dockerService.getDockerInfo();
    
    res.status(200).json({
        success: true,
        data: info
    });
};

export const checkDockerHealth = async (_req: Request, res: Response): Promise<void> => {
    await dockerService.getDockerInfo();
    
    res.status(200).json({
        success: true,
        message: 'Docker connection is healthy',
        data: { status: 'connected' }
    });
};
