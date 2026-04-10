import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as aiService from './ai.service';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
  const mockCreate = vi.fn().mockResolvedValue({
    choices: [{ message: { content: '{"bullets": ["Result 1", "Result 2"]}' } }]
  });
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate
        }
      };
    }
  };
});

// Mock Firecrawl
vi.mock('@mendable/firecrawl-js', () => {
  return {
    default: class {
      scrape = vi.fn().mockResolvedValue({ success: true, markdown: 'market data' });
    }
  };
});

describe('AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate bullet points', async () => {
    const bullets = await aiService.generateBulletPoints('Software Engineer', 'Google', 'Tech');
    expect(bullets).toEqual(['Result 1', 'Result 2']);
  });

  it('should extract JSON correctly', async () => {
    // This is an internal function but we can test it through other functions
    const bullets = await aiService.generateBulletPoints('x', 'y', 'z');
    expect(bullets).toBeInstanceOf(Array);
  });

  it('should handle failed JSON extraction gracefully', async () => {
    const mockOpenAI = new OpenAI();
    // @ts-ignore
    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [{ message: { content: 'No JSON here' } }]
    });

    await expect(aiService.generateBulletPoints('x', 'y', 'z')).rejects.toThrow('No JSON found in response');
  });
});
