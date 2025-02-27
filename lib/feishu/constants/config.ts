// 环境变量配置
export const ENV = {
  APP_ID: process.env.FEISHU_APP_ID,
  APP_SECRET: process.env.FEISHU_APP_SECRET,
  BASE_ID: process.env.FEISHU_BASE_ID,
  TABLE_ID: process.env.FEISHU_TABLE_ID,
  JINA_API_KEY: process.env.JINA_API_KEY,
  APP_ENV: process.env.APP_ENV || 'development',
  APP_DEBUG: process.env.APP_DEBUG === 'true',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
} as const;

// API配置
export const API_CONFIG = {
  BASE_URL: 'https://open.feishu.cn/open-apis/bitable/v1',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000'),
  MAX_RETRIES: parseInt(process.env.API_MAX_RETRIES || '3'),
} as const;

// 表格字段类型
export const FIELD_TYPES = {
  TEXT: 1,
  NUMBER: 2,
  SINGLE_SELECT: 3,
  MULTI_SELECT: 4,
  DATE_TIME: 5,
  CHECKBOX: 7,
  URL: 15,
} as const;

// 表格默认配置
export const TABLE_CONFIG = {
  DEFAULT_VIEW_NAME: '默认视图',
  DEFAULT_FIELDS: [
    {
      field_name: '标题',
      type: FIELD_TYPES.TEXT
    },
    {
      field_name: '状态',
      type: FIELD_TYPES.SINGLE_SELECT,
      property: {
        options: [
          { name: '待处理', color: 0 },
          { name: '处理中', color: 1 },
          { name: '已完成', color: 2 }
        ]
      }
    },
    {
      field_name: '创建时间',
      type: FIELD_TYPES.DATE_TIME
    }
  ]
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  MISSING_CONFIG: '缺少必要的配置参数',
  API_ERROR: 'API请求失败',
  NETWORK_ERROR: '网络请求失败',
  TIMEOUT_ERROR: '请求超时',
  AUTH_ERROR: '认证失败',
} as const;

// 其他常量
export const CONSTANTS = {
  PAGE_SIZE: 100,
  MAX_BATCH_SIZE: 500,
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIMEZONE: 'Asia/Shanghai',
} as const;

// 验证函数
export function validateConfig() {
  const requiredEnvVars = [
    'FEISHU_APP_ID',
    'FEISHU_APP_SECRET',
    'FEISHU_BASE_ID',
    'FEISHU_TABLE_ID'
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// 调试信息
export function getDebugInfo() {
  if (!ENV.APP_DEBUG) return null;

  return {
    env: ENV.APP_ENV,
    appId: ENV.APP_ID,
    baseId: ENV.BASE_ID,
    tableId: ENV.TABLE_ID,
    apiTimeout: API_CONFIG.TIMEOUT,
    maxRetries: API_CONFIG.MAX_RETRIES,
  };
} 