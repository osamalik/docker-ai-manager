import { Request, Response } from 'express';
import dockerService from '../services/docker.service.js';

export const listContainers = async (_req: Request, res: Response): Promise<void> => {
    const containers = await dockerService.listContainers();
    
    res.status(200).json({
        success: true,
        count: containers.length,
        data: containers
    });
};

export const getContainerStats = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const stats = await dockerService.getContainerStats(id);
    
    res.status(200).json({
        success: true,
        data: stats
    });
};

export const getContainerLogs = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const logs = await dockerService.getContainerLogs(id);
    
    res.status(200).json({
        success: true,
        data: { logs }
    });
};

export const startContainer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await dockerService.startContainer(id);
    
    res.status(200).json({
        success: true,
        message: `Container ${id} started successfully`,
        data: result
    });
};

export const stopContainer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await dockerService.stopContainer(id);
    
    res.status(200).json({
        success: true,
        message: `Container ${id} stopped successfully`,
        data: result
    });
};

export const restartContainer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await dockerService.restartContainer(id);
    
    res.status(200).json({
        success: true,
        message: `Container ${id} restarted successfully`,
        data: result
    });
};

export const createContainer = async (req: Request, res: Response): Promise<void> => {
    const containerOptions = {
        Image: req.body.image || 'nginx:latest',
        name: req.body.name || `container-${Date.now()}`,
        HostConfig: {
            PortBindings: req.body.portBindings || {
                '80/tcp': [{ HostPort: '8080' }]
            }
        }
    };

    const result = await dockerService.createContainer(containerOptions);
    
    res.status(201).json({
        success: true,
        message: 'Container created and started successfully',
        data: result
    });
};

export const removeContainer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const force = req.query.force === 'true';
    
    const result = await dockerService.removeContainer(id, force);
    
    res.status(200).json({
        success: true,
        message: `Container ${id} removed successfully`,
        data: result
    });
};

export const inspectContainer = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const details = await dockerService.inspectContainer(id);
    
    res.status(200).json({
        success: true,
        data: details
    });
};

export const bulkStopContainers = async (req: Request, res: Response): Promise<void> => {
    const { containerIds } = req.body;
    const results = await dockerService.bulkStopContainers(containerIds);
    
    res.status(200).json({
        success: true,
        message: 'Bulk stop operation completed',
        data: results
    });
};

export const bulkRemoveContainers = async (req: Request, res: Response): Promise<void> => {
    const { containerIds } = req.body;
    const force = req.query.force === 'true';
    const results = await dockerService.bulkRemoveContainers(containerIds, force);
    
    res.status(200).json({
        success: true,
        message: 'Bulk remove operation completed',
        data: results
    });
};

export const pruneContainers = async (_req: Request, res: Response): Promise<void> => {
    const result = await dockerService.pruneContainers();
    
    res.status(200).json({
        success: true,
        message: 'Stopped containers pruned successfully',
        data: result
    });
};
