import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { dockerService } from '../services/api';
import { Brain, Send, Loader } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);

  const nlMutation = useMutation(
    (q: string) => dockerService.naturalLanguageCommand(q),
    {
      onSuccess: (data) => {
        setResult(data.data.data);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      nlMutation.mutate(query);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Brain size={28} className="text-purple-500" />
        AI Assistant
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything... e.g., 'Show me all running containers'"
            className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={nlMutation.isLoading}
          />
          <button
            type="submit"
            disabled={nlMutation.isLoading || !query.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {nlMutation.isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>

      {nlMutation.isError && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg p-4 mb-4">
          Error processing your request. Make sure OpenAI API key is configured.
        </div>
      )}

      {result && (
        <div className="bg-slate-700 rounded-lg p-6">
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-2">Your Query:</div>
            <div className="text-white font-medium">{result.query}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-2">AI Interpretation:</div>
            <div className="text-white">{result.interpretation.intent}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400 mb-2">Action:</div>
              <div className="px-3 py-2 bg-purple-600 text-white rounded font-mono text-sm">
                {result.interpretation.action}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Parameters:</div>
              <div className="px-3 py-2 bg-slate-600 text-slate-200 rounded font-mono text-sm">
                {JSON.stringify(result.interpretation.parameters)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-slate-400">
        <div className="font-semibold text-white mb-2">Try asking:</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>"Show me all containers using more than 500MB memory"</li>
          <li>"Start the database container"</li>
          <li>"Get logs from the nginx container"</li>
        </ul>
      </div>
    </div>
  );
};
