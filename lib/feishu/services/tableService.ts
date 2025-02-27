import { 
  TableConfig, 
  CreateTableResponse, 
  FieldType,
  TableField,
  FieldOption
} from '../types/table';
import { API_ENDPOINTS } from '../constants/api';
import { FeiShuError } from '../utils/errors';
import { BaseService } from './baseService';

export class TableService extends BaseService {
  constructor(
    private appToken: string,
    private tableId: string
  ) {
    super();
  }

  /**
   * 创建新的数据表
   */
  public async createTable(config: TableConfig): Promise<CreateTableResponse> {
    try {
      console.log('Making request to:', API_ENDPOINTS.TABLES.CREATE(this.appToken));
      
      const token = await this.auth.getAccessToken();
      console.log('Got access token:', token);

      const response = await fetch(API_ENDPOINTS.TABLES.CREATE(this.appToken), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new FeiShuError('Failed to create table', data);
      }

      return data;
    } catch (error) {
      console.error('TableService error:', error);
      throw error;
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