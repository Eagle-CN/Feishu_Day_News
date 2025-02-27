// 基础字段值类型
export interface UserInfo {
  id: string;
}

export interface GroupInfo {
  id: string;
}

export interface Attachment {
  file_token: string;
}

export interface Hyperlink {
  link: string;
  text?: string;
}

// 字段值类型
export type FieldValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | UserInfo[]
  | GroupInfo[]
  | Attachment[]
  | Hyperlink
  | string[]  // 多选
  | null;

// 记录字段映射
export interface RecordFields {
  [fieldName: string]: FieldValue;
}

// 创建记录请求
export interface CreateRecordRequest {
  fields: RecordFields;
}

// 创建记录响应
export interface CreateRecordResponse {
  code: number;
  msg: string;
  data: {
    record: {
      record_id: string;
      fields: RecordFields;
    };
  };
}

// 批量创建记录请求
export interface BatchCreateRecordsRequest {
  records: CreateRecordRequest[];
}

// 批量创建记录响应
export interface BatchCreateRecordsResponse {
  code: number;
  msg: string;
  data: {
    records: {
      record_id: string;
      fields: RecordFields;
    }[];
  };
}

// 查询响应类型
export interface QueryResponse {
  code: number;
  data: {
    items: Array<{
      record_id: string;
      fields: RecordFields;
    }>;
    has_more: boolean;
    page_token?: string;
  };
} 