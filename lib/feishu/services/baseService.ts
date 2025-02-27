import { AuthService } from './authService';
import { FeiShuError } from '../utils/errors';

export class BaseService {
  protected auth: AuthService;

  constructor() {
    this.auth = AuthService.getInstance();
  }

  protected async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    try {
      const token = await this.auth.getAccessToken();
      const response = await fetch(endpoint, {
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: 'no-store'
      });

      const data = await response.json();
      
      if (!response.ok || data.code !== 0) {
        throw new FeiShuError('API request failed', { status: response.status, ...data });
      }

      return data;
    } catch (error) {
      throw error instanceof FeiShuError ? error : new FeiShuError('Request failed', error);
    }
  }
} 