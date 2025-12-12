import React from 'react';
import { useQuery } from 'react-query';
import { dockerService } from '../services/api';
import { DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

export const CostAnalysis: React.FC = () => {
  const { data: costData, isLoading } = useQuery(
    'cost-analysis',
    () => dockerService.getCostAnalysis(),
    { refetchInterval: 30000 }
  );

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-20 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const cost = costData?.data?.data;
  if (!cost) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <DollarSign size={28} />
        Cost Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6">
          <div className="text-blue-200 text-sm mb-2">Monthly Cost</div>
          <div className="text-3xl font-bold text-white">
            ${cost.totalCost.monthly}
          </div>
          <div className="text-blue-200 text-xs mt-2">
            ${cost.totalCost.daily}/day
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6">
          <div className="text-green-200 text-sm mb-2 flex items-center gap-2">
            <TrendingDown size={16} />
            Potential Savings
          </div>
          <div className="text-3xl font-bold text-white">
            ${cost.potentialSavings.monthly}
          </div>
          <div className="text-green-200 text-xs mt-2">
            {cost.potentialSavings.percentage}% reduction
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6">
          <div className="text-purple-200 text-sm mb-2">Active Containers</div>
          <div className="text-3xl font-bold text-white">
            {cost.containerCount}
          </div>
          <div className="text-purple-200 text-xs mt-2">
            {cost.idleContainers.length} idle
          </div>
        </div>
      </div>

      {cost.idleContainers.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-yellow-500" />
            Idle Containers
          </h3>
          
          <div className="space-y-3">
            {cost.idleContainers.map((container: any, index: number) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-white">{container.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{container.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-semibold">
                      ${container.potentialSavings.monthly}/mo
                    </div>
                    <div className="text-xs text-slate-400">wasted</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
