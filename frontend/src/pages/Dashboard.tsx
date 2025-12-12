import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ContainerList } from '../components/ContainerList';
import { CostAnalysis } from '../components/CostAnalysis';
import { AIAssistant } from '../components/AIAssistant';
import { Container } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const Dashboard: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-900">
        <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <Container size={32} className="text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Docker AI Controller
                </h1>
                <p className="text-sm text-slate-400">
                  AI-Powered Container Management & Cost Optimization
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-3">
              <CostAnalysis />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContainerList />
            </div>
            
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};
