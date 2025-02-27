import { 
  CreateRecordRequest, 
  CreateRecordResponse,
  BatchCreateRecordsRequest,
  BatchCreateRecordsResponse,
  FieldValue,
  UserInfo,
  GroupInfo,
  Attachment,
  Hyperlink,
  RecordFields,
  QueryResponse
} from '../types/record';
import { API_ENDPOINTS, DEFAULT_OPTIONS } from '../constants/api';
import { FeiShuError } from '../utils/errors';
import { BaseService } from './baseService';

// 查询条件运算符
export type OperatorType = 
  | 'is' 
  | 'isNot' 
  | 'contains' 
  | 'doesNotContain' 
  | 'isEmpty' 
  | 'isNotEmpty'
  | 'isGreater'
  | 'isGreaterEqual'
  | 'isLess'
  | 'isLessEqual';

// 查询条件
export interface QueryCondition {
  field_name: string;
  operator: OperatorType;
  value?: any[];
}

// 查询参数
export interface QueryOptions {
  pageSize?: number;
  pageToken?: string;
  viewId?: string;
  fields?: string[];
  filter?: {
    conditions: QueryCondition[];
    conjunction?: 'and' | 'or';
  };
  sort?: Array<{
    field_name: string;
    desc?: boolean;
  }>;
  automaticFields?: boolean;
}

export class RecordService extends BaseService {
  constructor(
    private appToken: string,
    private tableId: string
  ) {
    super();
  }

  /**
   * 查询记录
   */
  public async queryRecords(options: QueryOptions = {}): Promise<Array<{record_id: string; fields: RecordFields}>> {
    try {
      const url = API_ENDPOINTS.RECORDS.SEARCH(this.appToken, this.tableId);
      
      const response = await this.request<QueryResponse>(url, {
        method: 'POST',
        body: {
          page_size: options.pageSize || DEFAULT_OPTIONS.PAGE_SIZE,
          automatic_fields: options.automaticFields ?? false,
          field_names: options.fields,
          filter: options.filter || {
            conditions: [],
            conjunction: "and"
          },
          sort: options.sort || [],
          view_id: options.viewId
        }
      });

      const items = response.data.items || [];
      
      // 处理分页
      if (response.data.has_more && !options.pageToken && response.data.page_token) {
        const nextPage = await this.queryRecords({
          ...options,
          pageToken: response.data.page_token
        });
        items.push(...nextPage);
      }

      return items;
    } catch (error) {
      throw error instanceof FeiShuError ? error : new FeiShuError('Query failed', error);
    }
  }

  /**
   * 创建记录
   */
  public async createRecord(request: CreateRecordRequest): Promise<CreateRecordResponse> {
    return this.request<CreateRecordResponse>(
      API_ENDPOINTS.RECORDS.CREATE(this.appToken, this.tableId),
      {
        method: 'POST',
        body: request
      }
    );
  }

  /**
   * 批量创建记录
   */
  public async batchCreateRecords(request: BatchCreateRecordsRequest): Promise<BatchCreateRecordsResponse> {
    return this.request<BatchCreateRecordsResponse>(
      API_ENDPOINTS.RECORDS.BATCH_CREATE(this.appToken, this.tableId),
      {
        method: 'POST',
        body: request
      }
    );
  }

  /**
   * 便捷方法: 创建用户字段值
   */
  public static createUserField(userIds: string[]): UserInfo[] {
    return userIds.map(id => ({ id }));
  }

  /**
   * 便捷方法: 创建群组字段值
   */
  public static createGroupField(groupIds: string[]): GroupInfo[] {
    return groupIds.map(id => ({ id }));
  }

  /**
   * 便捷方法: 创建附件字段值
   */
  public static createAttachmentField(fileTokens: string[]): Attachment[] {
    return fileTokens.map(token => ({ file_token: token }));
  }

  /**
   * 便捷方法: 创建超链接字段值
   */
  public static createHyperlinkField(link: string, text?: string): Hyperlink {
    return { link, text };
  }

  /**
   * 便捷方法: 创建日期字段值
   */
  public static createDateField(date: Date | string | number): number {
    const timestamp = new Date(date).getTime();
    if (isNaN(timestamp)) {
      throw new Error('Invalid date value');
    }
    return timestamp;
  }

  /**
   * 便捷查询方法：按字段值查询
   */
  public async findByField(fieldName: string, value: any) {
    return this.queryRecords({
      filter: {
        conditions: [{ field_name: fieldName, operator: 'is', value: [value] }]
      }
    });
  }

  /**
   * 便捷查询方法：按时间范围查询
   */
  public async findByDateRange(fieldName: string, startDate: Date, endDate: Date) {
    return this.queryRecords({
      filter: {
        conditions: [
          { field_name: fieldName, operator: 'isGreaterEqual', value: [startDate.getTime()] },
          { field_name: fieldName, operator: 'isLessEqual', value: [endDate.getTime()] }
        ],
        conjunction: 'and'
      }
    });
  }

  /**
   * 便捷查询方法：按关键词搜索
   */
  public async search(fieldName: string, keyword: string) {
    return this.queryRecords({
      filter: {
        conditions: [{ field_name: fieldName, operator: 'contains', value: [keyword] }]
      }
    });
  }
} 