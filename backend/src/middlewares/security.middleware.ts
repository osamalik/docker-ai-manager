import { Request, Response, NextFunction } from 'express';
import { getOwnContainerId } from '../config/docker.config.js';

export const preventSelfTermination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const ownId = await getOwnContainerId();
  
  if (ownId && id.startsWith(ownId)) {
    res.status(403).json({
      success: false,
      error: 'Cannot control the backend container from within itself. This would cause the API to crash.',
    });
    return;
  }
  
  next();
};

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    return next();
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid or missing API key',
    });
  }

  next();
};

export const validateContainerId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id || id.length < 12) {
    res.status(400).json({
      success: false,
      error: 'Invalid container ID',
    });
    return;
  }

  if (!/^[a-f0-9]+$/i.test(id)) {
    res.status(400).json({
      success: false,
      error: 'Container ID must be hexadecimal',
    });
    return;
  }

  next();
};
