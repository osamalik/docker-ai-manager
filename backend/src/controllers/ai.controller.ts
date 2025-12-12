import { Request, Response } from 'express';
import { aiService } from '../services/ai.service.js';
import dockerService from '../services/docker.service.js';
import { costCalculatorService } from '../services/cost.service.js';

export const analyzeContainerLogs = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const logs = await dockerService.getContainerLogs(id);
  const container = await dockerService.inspectContainer(id);
  const containerName = container.Name.replace('/', '');
  
  const analysis = await aiService.analyzeLogs(logs, containerName);
  
  res.json({
    success: true,
    data: {
      container: containerName,
      analysis,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getOptimizationSuggestions = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const stats = await dockerService.getContainerStats(id);
  const container = await dockerService.inspectContainer(id);
  
  const cpuPercent = stats.cpu_stats?.cpu_usage
    ? ((stats.cpu_stats.cpu_usage.total_usage - (stats.precpu_stats?.cpu_usage?.total_usage || 0)) /
        (stats.cpu_stats.system_cpu_usage! - (stats.precpu_stats?.system_cpu_usage || 0))) *
      (stats.cpu_stats.online_cpus || 1) *
      100
    : 0;
  
  const memoryUsage = stats.memory_stats?.usage || 0;
  const memoryLimit = stats.memory_stats?.limit || 1;
  
  const optimization = await aiService.suggestOptimization({
    name: container.Name.replace('/', ''),
    cpuPercent,
    memoryUsage,
    memoryLimit,
  });
  
  const currentUsage = {
    cpuPercent,
    memoryMB: memoryUsage / (1024 * 1024),
    uptime: Date.now() - new Date(container.State.StartedAt).getTime(),
  };
  
  const optimizedUsage = {
    cpuPercent: cpuPercent * 0.7,
    memoryMB: (memoryUsage / (1024 * 1024)) * 0.8,
    uptime: currentUsage.uptime,
  };
  
  const costAnalysis = costCalculatorService.calculateOptimizationSavings(
    currentUsage,
    optimizedUsage
  );
  
  res.json({
    success: true,
    data: {
      container: container.Name.replace('/', ''),
      optimization,
      costAnalysis,
      currentStats: {
        cpuPercent: cpuPercent.toFixed(2),
        memoryUsage: `${(memoryUsage / (1024 * 1024)).toFixed(2)} MB`,
        memoryPercent: ((memoryUsage / memoryLimit) * 100).toFixed(2),
      },
    },
  });
};

export const naturalLanguageCommand = async (req: Request, res: Response) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query is required',
    });
  }
  
  const interpretation = await aiService.naturalLanguageQuery(query);
  
  return res.json({
    success: true,
    data: {
      query,
      interpretation,
      message: 'Use the interpreted action and parameters to execute the command',
    },
  });
};

export const getCostAnalysis = async (_req: Request, res: Response) => {
  const containers = await dockerService.listContainers(true);
  
  const containerStats = await Promise.all(
    containers.map(async (container: any) => {
      try {
        const stats = await dockerService.getContainerStats(container.Id);
        const cpuPercent = stats.cpu_stats?.cpu_usage
          ? ((stats.cpu_stats.cpu_usage.total_usage - (stats.precpu_stats?.cpu_usage?.total_usage || 0)) /
              (stats.cpu_stats.system_cpu_usage! - (stats.precpu_stats?.system_cpu_usage || 0))) *
            (stats.cpu_stats.online_cpus || 1) *
            100
          : 0;
        
        const memoryUsage = stats.memory_stats?.usage || 0;
        const uptime = Date.now() - new Date(container.Created * 1000).getTime();
        
        return {
          name: container.Names[0].replace('/', ''),
          cpuPercent,
          memoryMB: memoryUsage / (1024 * 1024),
          uptime: uptime / 1000,
        };
      } catch (error) {
        return null;
      }
    })
  );
  
  const validStats = containerStats.filter((s: any) => s !== null) as Array<{
    name: string;
    cpuPercent: number;
    memoryMB: number;
    uptime: number;
  }>;
  
  const totalCost = costCalculatorService.calculateTotalInfrastructureCost(validStats);
  const idleContainers = costCalculatorService.analyzeIdleContainers(validStats);
  
  const totalIdleSavings = idleContainers.reduce(
    (sum, c) => sum + c.potentialSavings.monthly,
    0
  );
  
  res.json({
    success: true,
    data: {
      totalCost: totalCost.total,
      containerCount: validStats.length,
      idleContainers,
      potentialSavings: {
        monthly: parseFloat(totalIdleSavings.toFixed(2)),
        percentage: parseFloat(((totalIdleSavings / totalCost.total.monthly) * 100).toFixed(1)),
      },
      timestamp: new Date().toISOString(),
    },
  });
};
