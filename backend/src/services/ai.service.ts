import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export class AIService {
  async analyzeLogs(logs: string, containerName: string): Promise<{
    diagnosis: string;
    issues: string[];
    suggestions: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> {
    if (!process.env.OPENAI_API_KEY) {
      return {
        diagnosis: 'AI analysis unavailable - OpenAI API key not configured',
        issues: [],
        suggestions: ['Configure OPENAI_API_KEY environment variable'],
        severity: 'low',
      };
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert Docker container diagnostician. Analyze container logs and provide:
1. A brief diagnosis (2-3 sentences)
2. List of specific issues found
3. Actionable suggestions to fix them
4. Severity level (low/medium/high/critical)

Respond in JSON format:
{
  "diagnosis": "string",
  "issues": ["string"],
  "suggestions": ["string"],
  "severity": "low|medium|high|critical"
}`,
          },
          {
            role: 'user',
            content: `Container: ${containerName}\n\nLogs:\n${logs.slice(-3000)}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      const err = error as Error;
      throw new Error(`AI analysis failed: ${err.message}`);
    }
  }

  async suggestOptimization(containerStats: {
    name: string;
    cpuPercent: number;
    memoryUsage: number;
    memoryLimit: number;
  }): Promise<{
    recommendation: string;
    potentialSavings: string;
    actions: string[];
  }> {
    if (!process.env.OPENAI_API_KEY) {
      return {
        recommendation: 'AI optimization unavailable',
        potentialSavings: 'N/A',
        actions: ['Configure OPENAI_API_KEY'],
      };
    }

    try {
      const memoryPercent = (containerStats.memoryUsage / containerStats.memoryLimit) * 100;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Docker resource optimization expert. Based on container resource usage, provide:
1. A specific recommendation
2. Estimated cost/resource savings
3. Step-by-step actions to implement

Respond in JSON format:
{
  "recommendation": "string",
  "potentialSavings": "string",
  "actions": ["string"]
}`,
          },
          {
            role: 'user',
            content: `Container: ${containerStats.name}
CPU Usage: ${containerStats.cpuPercent.toFixed(2)}%
Memory Usage: ${containerStats.memoryUsage} bytes (${memoryPercent.toFixed(1)}% of ${containerStats.memoryLimit} bytes limit)

Suggest optimizations to reduce resource usage and costs.`,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Optimization analysis failed: ${err.message}`);
    }
  }

  async naturalLanguageQuery(query: string): Promise<{
    intent: string;
    action: string;
    parameters: Record<string, any>;
  }> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('AI features require OpenAI API key');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Docker command interpreter. Convert natural language queries into Docker API actions.

Available actions:
- list_containers: List all containers (with optional filters)
- start_container: Start a container
- stop_container: Stop a container
- restart_container: Restart a container
- get_logs: Get container logs
- get_stats: Get container resource stats
- list_images: List Docker images

Respond in JSON format:
{
  "intent": "what user wants to do",
  "action": "api_action_name",
  "parameters": {}
}`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Natural language processing failed: ${err.message}`);
    }
  }
}

export const aiService = new AIService();
