import { ParsedContent, JinaResponse } from '@/types/jinaParser';

export class JinaParser {
  private apiKey: string;
  private maxRetries: number;
  private timeout: number;

  constructor(apiKey: string, maxRetries = 3, timeout = 30000) {
    this.apiKey = apiKey;
    this.maxRetries = maxRetries;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  public async parseUrl(url: string, retryCount = 0): Promise<ParsedContent> {
    if (!this.apiKey) {
      throw new Error('JINA_API_KEY is not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `https://r.jina.ai/${encodeURIComponent(url)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Return-Format': 'text'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as JinaResponse;

      if (data.code !== 200) {
        throw new Error(`API error! code: ${data.code}, status: ${data.status}`);
      }

      return {
        title: data.data.title || '',
        description: data.data.description || '',
        content: data.data.text || '',
        url: data.data.url || url,
        publishedTime: data.data.publishedTime || new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error parsing ${url}:`, error);

      // Retry logic
      if (retryCount < this.maxRetries) {
        console.log(`Retrying (${retryCount + 1}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.parseUrl(url, retryCount + 1);
      }

      return {
        title: '',
        description: '',
        content: '',
        url: url,
        publishedTime: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  public static extractMainContent(content: string): string {
    const lines = content.split('\n').filter(line => line.trim());
    
    let maxBlock = '';
    let currentBlock = '';
    
    for (const line of lines) {
      if (line.length > 20) {
        currentBlock += line + '\n';
      } else {
        if (currentBlock.length > maxBlock.length) {
          maxBlock = currentBlock;
        }
        currentBlock = '';
      }
    }

    return maxBlock || content;
  }
} 