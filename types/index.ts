export interface NewsItem {
  record_id: string;
  fields: {
    标题?: string;
    内容?: string;
    链接?: string;
    来源?: string;
    分类?: string;
    发布时间?: string | number;
    摘要?: string;
    关键词?: string[];
    状态?: string;
  };
}

export interface TableResponse {
  code: number;
  data: {
    items: NewsItem[];
    page_token?: string;
    has_more: boolean;
    total: number;
  };
  msg: string;
} 