import OpenAI from 'openai';
import { env } from '../config/env';

// Instanciar el cliente una sola vez para reutilizar la conexión HTTP
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/** Estructura de cada sugerencia que devuelve la IA */
export interface TaskSuggestion {
  title: string;
  description: string;
}

/**
 * Pide a GPT sugerencias de tareas dado el nombre de un proyecto.
 * Devuelve un arreglo tipado de sugerencias listas para mostrar o crear.
 *
 * Decisión arquitectónica: el servicio IA es independiente del de tareas
 * para respetar el principio de responsabilidad única y facilitar el
 * reemplazo del proveedor de IA sin tocar la lógica de negocio principal.
 */
export async function suggestTasks(projectName: string): Promise<TaskSuggestion[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    // Temperature baja para respuestas más deterministas y estructuradas
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

  // Parsear la respuesta de la IA; GPT respeta el json_object format
  const raw = completion.choices[0]?.message.content ?? '{"suggestions":[]}';
  const parsed = JSON.parse(raw) as { suggestions: TaskSuggestion[] };

  return parsed.suggestions;
}
