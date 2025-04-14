import { z } from "zod";

export const updateLLMConfigSchema = z.object({
  model: z.string().min(1),
  endpoint: z.string().startsWith('https://').min(1),
  apiKey: z.string().min(1),
});

export const LLMGenerateSchema = z.object({
  content: z.string().min(1),
});
