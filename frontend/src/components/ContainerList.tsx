import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { dockerService } from '../services/api';
import { Play, Square, RotateCw, Trash2, Brain } from 'lucide-react';

interface Container {
  Id: string;
  Names: string[];
  State: string;
  Status: string;
  Image: string;
}

export const ContainerList: React.FC = () => {
  const queryClient = useQueryClient();
  const [_selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const { data: containersData, isLoading } = useQuery(
    'containers',
    () => dockerService.listContainers(),
    { refetchInterval: 3000 }
  );

  const startMutation = useMutation(
    (id: string) => dockerService.startContainer(id),
    { onSuccess: () => queryClient.invalidateQueries('containers') }
  );

  const stopMutation = useMutation(
    (id: string) => dockerService.stopContainer(id),
    { 
      onSuccess: () => queryClient.invalidateQueries('containers'),
      onError: (error: any) => {
        const message = error?.response?.data?.error || 'Failed to stop container';
        alert(message);
      }
    }
  );

  const restartMutation = useMutation(
    (id: string) => dockerService.restartContainer(id),
    { 
      onSuccess: () => queryClient.invalidateQueries('containers'),
      onError: (error: any) => {
        const message = error?.response?.data?.error || 'Failed to restart container';
        alert(message);
      }
    }
  );

  const removeMutation = useMutation(
    (id: string) => dockerService.removeContainer(id),
    { 
      onSuccess: () => queryClient.invalidateQueries('containers'),
      onError: (error: any) => {
        const message = error?.response?.data?.error || 'Failed to remove container';
        alert(message);
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const containers: Container[] = containersData?.data?.data || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Containers</h2>
      
      {containers.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
          No containers found
        </div>
      ) : (
        <div className="grid gap-4">
          {containers.map((container) => (
            <div
              key={container.Id}
              className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {container.Names[0]?.replace('/', '')}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        container.State === 'running'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {container.State}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{container.Image}</p>
                  <p className="text-xs text-slate-500">{container.Status}</p>
                </div>

                <div className="flex gap-2">
                  {container.State !== 'running' && (
                    <button
                      onClick={() => startMutation.mutate(container.Id)}
                      disabled={startMutation.isLoading}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      title="Start"
                    >
                      <Play size={18} />
                    </button>
                  )}
                  
                  {container.State === 'running' && (
                    <>
                      <button
                        onClick={() => stopMutation.mutate(container.Id)}
                        disabled={stopMutation.isLoading}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        title="Stop"
                      >
                        <Square size={18} />
                      </button>
                      
                      <button
                        onClick={() => restartMutation.mutate(container.Id)}
                        disabled={restartMutation.isLoading}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        title="Restart"
                      >
                        <RotateCw size={18} />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setSelectedContainer(container.Id)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    title="AI Analysis"
                  >
                    <Brain size={18} />
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Delete this container?')) {
                        removeMutation.mutate(container.Id);
                      }
                    }}
                    disabled={removeMutation.isLoading}
                    className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
