import { ENV } from '../constants/config';
import { FeiShuError } from '../utils/errors';

export class AuthService {
  private static instance: AuthService;
  private accessTokenCache: { token: string; expireTime: number } | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async getAccessToken(): Promise<string> {
    if (this.accessTokenCache?.expireTime && this.accessTokenCache.expireTime > Date.now()) {
      return this.accessTokenCache.token;
    }

    try {
      const response = await fetch(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            app_id: ENV.APP_ID,
            app_secret: ENV.APP_SECRET,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok || !data.tenant_access_token) {
        throw new FeiShuError('Failed to get access token', data);
      }

      this.accessTokenCache = {
        token: data.tenant_access_token,
        expireTime: Date.now() + (data.expire - 300) * 1000
      };

      return this.accessTokenCache.token;
    } catch (error) {
      throw new FeiShuError('Failed to get access token', error);
    }
  }
} 