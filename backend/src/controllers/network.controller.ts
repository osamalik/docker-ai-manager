import { Request, Response } from 'express';
import dockerService from '../services/docker.service.js';

export const listNetworks = async (_req: Request, res: Response): Promise<void> => {
    const networks = await dockerService.listNetworks();
    
    res.status(200).json({
        success: true,
        count: networks.length,
        data: networks
    });
};

export const createNetwork = async (req: Request, res: Response): Promise<void> => {
    const { name, driver } = req.body;
    const result = await dockerService.createNetwork(name, driver);
    
    res.status(201).json({
        success: true,
        message: 'Network created successfully',
        data: result
    });
};

export const removeNetwork = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await dockerService.removeNetwork(id);
    
    res.status(200).json({
        success: true,
        message: `Network ${id} removed successfully`
    });
};
