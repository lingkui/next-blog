import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { updateLLMConfig } from '../actions';
import { getLLMConfig } from '../queries';
import { LLMGenerateSchema, updateLLMConfigSchema } from '../schemas';

export const runtime = 'edge';

const app = new Hono()
  .get('/', sessionMiddleware, async (c) => {
    const { model, endpoint, apiKey } = await getLLMConfig();

    return c.json({
      data: {
        model,
        endpoint,
        apiKey,
      },
    });
  })
  .patch('/', sessionMiddleware, zValidator('json', updateLLMConfigSchema), async (c) => {
    const { model, endpoint, apiKey } = c.req.valid('json');

    try {
      await updateLLMConfig(model, endpoint, apiKey);
      return c.json({
        message: 'LLM config updated successfully',
      });
    } catch {
      return c.json({ error: 'Failed to update LLM config' }, 500);
    }
  })
  .get('/status', sessionMiddleware, async (c) => {
    const { model, endpoint, apiKey } = await getLLMConfig();
    const isLLMReady = model && endpoint && apiKey;

    return c.json({ data: { isReady: !!isLLMReady } });
  })
  .post('/slug', zValidator('json', LLMGenerateSchema), async (c) => {
    const { model, endpoint, apiKey } = await getLLMConfig();
    const isLLMReady = model && endpoint && apiKey;

    if (!isLLMReady) {
      return c.json({ error: 'LLM is not ready' }, 400);
    }

    const { content } = c.req.valid('json');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的 SEO 优化专家，擅长基于文章标题生成多个高质量、简洁且国际化的 URL slug。你的目标是确保 slug 符合 SEO 最佳实践（短小、描述性、使用连字符、避免特殊字符）、易于阅读，并适合全球受众。请以逗号分隔的形式（前端需要解析为 JSON 数组，例如 ["slug1", "slug2", "slug3"]）返回多个（>= 3 个）slug选项，确保每个 slug 都独一无二且与标题内容相关。`,
            },
            {
              role: 'user',
              content: `为以下博客标题生成高质量的 slug，确保符合 SEO 标准并适合国际化使用：\n${content}`,
            },
          ],
          stream: true,
        }),
      });

      return new Response(response.body, {
        headers: { 'content-type': 'text/event-stream' },
      });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          error:
            'Failed to connect to LLM Service. Please check your LLM config is correct or the service is not available in your region',
        },
        500,
      );
    }
  })
  .post('/excerpt', zValidator('json', LLMGenerateSchema), async (c) => {
    const { model, endpoint, apiKey } = await getLLMConfig();
    const isLLMReady = model && endpoint && apiKey;

    if (!isLLMReady) {
      return c.json({ error: 'LLM is not ready' }, 400);
    }

    const { content } = c.req.valid('json');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的文本摘要专家，擅长为博客文章生成简洁且高质量的摘要（用于社交媒体分享）。你的目标是用一到两句话准确概括文章的核心内容，避免冗长细节，确保摘要通俗易懂且吸引读者。请以逗号分隔的形式（前端需要解析为 JSON 数组，例如 ["摘要1", "摘要2", "摘要3"]）返回多个（>= 3 个）摘要选项，确保每个摘要都独一无二且与文章内容相关。`,
            },
            {
              role: 'user',
              content: `为以下博客内容生成多个高质量摘要：\n${content}`,
            },
          ],
          stream: true,
        }),
      });

      return new Response(response.body, {
        headers: { 'content-type': 'text/event-stream' },
      });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          error:
            'Failed to connect to LLM Service. Please check your LLM config is correct or the service is not available in your region',
        },
        500,
      );
    }
  });

export default app;
