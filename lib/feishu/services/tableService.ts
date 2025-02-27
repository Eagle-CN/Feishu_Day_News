import { 
  TableConfig, 
  CreateTableResponse, 
  FieldType,
  TableField,
  FieldOption
} from '../types/table';
import { API_ENDPOINTS } from '../constants/api';
import { FeiShuError } from '../utils/errors';

export class TableService {
  private appToken: string;
  private accessToken: string;

  constructor(appToken: string, accessToken: string) {
    this.appToken = appToken;
    this.accessToken = accessToken;
  }

  /**
   * 创建新的数据表
   */
  public async createTable(config: TableConfig): Promise<CreateTableResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.TABLES.CREATE(this.appToken), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          table: {
            name: config.name,
            default_view_name: config.default_view_name || '默认视图',
            fields: config.fields
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new FeiShuError('Failed to create table', error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FeiShuError) {
        throw error;
      }
      throw new FeiShuError('Error creating table', error);
    }
  }

  /**
   * 创建字段配置生成器
   */
  public static createField(name: string, type: FieldType): TableField {
    return {
      field_name: name,
      type: type
    };
  }

  /**
   * 创建单选字段
   */
  public static createSingleSelect(name: string, options: FieldOption[]): TableField {
    return {
      field_name: name,
      type: FieldType.SingleSelect,
      ui_type: 'SingleSelect',
      property: {
        options: options
      }
    };
  }

  // ... 可以添加更多便捷方法
} 