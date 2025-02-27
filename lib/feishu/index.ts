import { TableService } from './services/tableService';
import { RecordService } from './services/recordService';
import { ENV, validateConfig } from './constants/config';
import { FeiShuError } from './utils/errors';
import { RecordFields } from './types/record';
import { QueryOptions } from './services/recordService';

// 验证配置
validateConfig();

// 创建服务实例
const tableService = new TableService(ENV.BASE_ID!, ENV.TABLE_ID!);
const recordService = new RecordService(ENV.BASE_ID!, ENV.TABLE_ID!);

// 获取所有新闻数据
export async function getAllNews(options: QueryOptions = {}) {
  try {
    // 使用默认配置
    const defaultOptions: QueryOptions = {
      pageSize: 100,
      fields: [
        "标题",
        "链接",
        "内容",
        "摘要",
        "发布时间",
        "来源",
        "分类",
        "状态",
        "关键词"
      ],
      sort: [
        {
          field_name: "发布时间",
          desc: true
        }
      ]
    };

    // 合并选项
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      sort: options.sort || defaultOptions.sort,
      fields: options.fields || defaultOptions.fields
    };

    const result = await recordService.queryRecords(mergedOptions);
    console.log('Query result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// 按状态查询新闻
export async function getNewsByStatus(status: string) {
  return recordService.findByField('状态', status);
}

// 按时间范围查询新闻
export async function getNewsByDateRange(startDate: Date, endDate: Date) {
  return recordService.findByDateRange('发布时间', startDate, endDate);
}

// 搜索新闻
export async function searchNews(keyword: string) {
  return recordService.search('标题', keyword);
}

// 使用示例：
export async function getLatestNews() {
  return getAllNews({
    pageSize: 20,
    sort: [
      {
        field_name: "发布时间",
        desc: true
      }
    ],
    filter: {
      conditions: [
        {
          field_name: "状态",
          operator: "is",
          value: ["已发布"]
        }
      ]
    }
  });
}

// 添加新闻
export async function addNews(fields: RecordFields) {
  try {
    const result = await recordService.createRecord({
      fields: fields
    });
    return result;
  } catch (error) {
    console.error('Error adding news:', error);
    throw error;
  }
}

// 批量添加新闻
export async function batchAddNews(newsItems: RecordFields[]) {
  try {
    const result = await recordService.batchCreateRecords({
      records: newsItems.map(fields => ({ fields }))
    });
    return result;
  } catch (error) {
    console.error('Error batch adding news:', error);
    throw error;
  }
}

// 导出所有服务和类型
export * from './types/table';
export * from './types/record';
export * from './services/tableService';
export * from './services/recordService';
export * from './constants/config';
export * from './constants/api';
export * from './utils/errors'; 