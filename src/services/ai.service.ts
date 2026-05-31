import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export interface TaskSuggestion {
  title: string;
  description: string;
}

export async function suggestTasks(projectName: string): Promise<TaskSuggestion[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.5,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Eres un asistente de gestión de proyectos. Responde únicamente con JSON válido ' +
          'con la forma: { "suggestions": [{ "title": string, "description": string }] }. ' +
          'Devuelve entre 3 y 5 sugerencias de tareas concretas y accionables.',
      },
      {
        role: 'user',
        content: `Dame sugerencias de tareas para un proyecto llamado: "${projectName}"`,
      },
    ],
  });

  const raw = completion.choices[0]?.message.content ?? '{"suggestions":[]}';
  const parsed = JSON.parse(raw) as { suggestions: TaskSuggestion[] };

  return parsed.suggestions;
}
