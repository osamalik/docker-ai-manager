interface ResourceUsage {
  cpuPercent: number;
  memoryMB: number;
  uptime: number;
}

interface CostEstimate {
  hourly: number;
  daily: number;
  monthly: number;
  currency: string;
}

export class CostCalculatorService {
  private readonly CPU_COST_PER_CORE_HOUR = 0.04;
  private readonly MEMORY_COST_PER_GB_HOUR = 0.005;

  calculateContainerCost(usage: ResourceUsage): CostEstimate {
    const cpuCores = usage.cpuPercent / 100;
    const memoryGB = usage.memoryMB / 1024;

    const cpuCostPerHour = cpuCores * this.CPU_COST_PER_CORE_HOUR;
    const memoryCostPerHour = memoryGB * this.MEMORY_COST_PER_GB_HOUR;

    const hourly = cpuCostPerHour + memoryCostPerHour;
    const daily = hourly * 24;
    const monthly = daily * 30;

    return {
      hourly: parseFloat(hourly.toFixed(4)),
      daily: parseFloat(daily.toFixed(2)),
      monthly: parseFloat(monthly.toFixed(2)),
      currency: 'USD',
    };
  }

  calculateOptimizationSavings(
    current: ResourceUsage,
    optimized: ResourceUsage
  ): {
    currentCost: CostEstimate;
    optimizedCost: CostEstimate;
    savings: CostEstimate;
    savingsPercent: number;
  } {
    const currentCost = this.calculateContainerCost(current);
    const optimizedCost = this.calculateContainerCost(optimized);

    const savings: CostEstimate = {
      hourly: parseFloat((currentCost.hourly - optimizedCost.hourly).toFixed(4)),
      daily: parseFloat((currentCost.daily - optimizedCost.daily).toFixed(2)),
      monthly: parseFloat((currentCost.monthly - optimizedCost.monthly).toFixed(2)),
      currency: 'USD',
    };

    const savingsPercent = ((savings.monthly / currentCost.monthly) * 100);

    return {
      currentCost,
      optimizedCost,
      savings,
      savingsPercent: parseFloat(savingsPercent.toFixed(1)),
    };
  }

  analyzeIdleContainers(containers: Array<{
    name: string;
    cpuPercent: number;
    memoryMB: number;
    uptime: number;
  }>): Array<{
    name: string;
    reason: string;
    potentialSavings: CostEstimate;
  }> {
    const idleContainers = containers.filter(
      c => c.cpuPercent < 1 && c.uptime > 3600
    );

    return idleContainers.map(container => {
      const cost = this.calculateContainerCost(container);
      return {
        name: container.name,
        reason: `Idle for ${Math.floor(container.uptime / 3600)} hours with <1% CPU usage`,
        potentialSavings: cost,
      };
    });
  }

  calculateTotalInfrastructureCost(containers: ResourceUsage[]): {
    total: CostEstimate;
    breakdown: Array<{ index: number; cost: CostEstimate }>;
  } {
    const breakdown = containers.map((container, index) => ({
      index,
      cost: this.calculateContainerCost(container),
    }));

    const total: CostEstimate = {
      hourly: breakdown.reduce((sum, b) => sum + b.cost.hourly, 0),
      daily: breakdown.reduce((sum, b) => sum + b.cost.daily, 0),
      monthly: breakdown.reduce((sum, b) => sum + b.cost.monthly, 0),
      currency: 'USD',
    };

    return {
      total: {
        hourly: parseFloat(total.hourly.toFixed(4)),
        daily: parseFloat(total.daily.toFixed(2)),
        monthly: parseFloat(total.monthly.toFixed(2)),
        currency: 'USD',
      },
      breakdown,
    };
  }
}

export const costCalculatorService = new CostCalculatorService();
