import { Request, Response } from 'express';
import dockerService from '../services/docker.service.js';

export const listVolumes = async (_req: Request, res: Response): Promise<void> => {
    const volumes = await dockerService.listVolumes();
    
    res.status(200).json({
        success: true,
        count: volumes.Volumes?.length || 0,
        data: volumes.Volumes
    });
};

export const createVolume = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    const result = await dockerService.createVolume(name);
    
    res.status(201).json({
        success: true,
        message: 'Volume created successfully',
        data: result
    });
};

export const removeVolume = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    await dockerService.removeVolume(name);
    
    res.status(200).json({
        success: true,
        message: `Volume ${name} removed successfully`
    });
};

export const pruneVolumes = async (_req: Request, res: Response): Promise<void> => {
    const result = await dockerService.pruneVolumes();
    
    res.status(200).json({
        success: true,
        message: 'Unused volumes pruned successfully',
        data: result
    });
};
