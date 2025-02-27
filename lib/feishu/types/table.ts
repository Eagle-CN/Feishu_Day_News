export interface FieldOption {
  name: string;
  color: number;
}

export interface FieldProperty {
  options?: FieldOption[];
  formatter?: string;
  [key: string]: any;
}

export interface TableField {
  field_name: string;
  type: number;
  ui_type?: string;
  property?: FieldProperty;
}

export interface TableConfig {
  name: string;
  default_view_name?: string;
  fields: TableField[];
}

export interface CreateTableResponse {
  code: number;
  msg: string;
  data: {
    table_id: string;
    revision: number;
  };
}

// 字段类型枚举
export enum FieldType {
  Text = 1,
  Number = 2,
  SingleSelect = 3,
  MultiSelect = 4,
  DateTime = 5,
  Checkbox = 7,
  Url = 15,
  // ... 可以添加更多字段类型
} 