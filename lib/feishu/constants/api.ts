export const BASE_URL = 'https://open.feishu.cn/open-apis/bitable/v1';

export const API_ENDPOINTS = {
  RECORDS: {
    SEARCH: (appToken: string, tableId: string) => 
      `${BASE_URL}/apps/${appToken}/tables/${tableId}/records/search`,
    CREATE: (appToken: string, tableId: string) => 
      `${BASE_URL}/apps/${appToken}/tables/${tableId}/records`,
    BATCH_CREATE: (appToken: string, tableId: string) =>
      `${BASE_URL}/apps/${appToken}/tables/${tableId}/records/batch_create`,
  },
  TABLES: {
    LIST: (appToken: string) => 
      `${BASE_URL}/apps/${appToken}/tables`,
    GET: (appToken: string, tableId: string) => 
      `${BASE_URL}/apps/${appToken}/tables/${tableId}`,
    CREATE: (appToken: string) => 
      `${BASE_URL}/apps/${appToken}/tables`,
  }
} as const;

export const DEFAULT_OPTIONS = {
  PAGE_SIZE: 100,
  CACHE_DURATION: 300, // 5 minutes
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const; 