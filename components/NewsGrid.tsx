'use client';

import { RecordFields } from '@/lib/feishu';

interface NewsGridProps {
  news: {
    record_id: string;
    fields: RecordFields;
  }[];
}

// 处理链接字段
interface FeishuLink {
  text?: string;
  type?: string;
  link?: string;
}

// 获取链接值
function getLinkValue(link: string | FeishuLink | undefined): string {
  if (!link) return '#';
  if (typeof link === 'string') return link;
  return link.link || link.text || '#';
}

// 获取文本值
function getTextValue(text: any): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) {
    return text.map(t => t.text || '').join('');
  }
  if (typeof text === 'object' && text !== null) {
    return text.text || '';
  }
  return '';
}

// 格式化日期
function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '';
  }
}

// 获取标签
function getTags(tags: any): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return [];
}

export default function NewsGrid({ news }: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.filter(item => Object.keys(item.fields).length > 0).map((item) => (
        <article 
          key={item.record_id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                {getTextValue(item.fields.分类)}
              </span>
              <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                {getTextValue(item.fields.来源)}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
              <a 
                href={getLinkValue(item.fields.链接 as string | FeishuLink)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {getTextValue(item.fields.标题)}
              </a>
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {getTextValue(item.fields.摘要)}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {getTags(item.fields.关键词).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <time dateTime={new Date(item.fields.发布时间 as number).toISOString()}>
                {formatDate(item.fields.发布时间 as number)}
              </time>
              <span className={`px-2 py-1 rounded text-xs ${
                item.fields.状态 === '已发布' ? 'bg-green-100 text-green-800' :
                item.fields.状态 === '处理中' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getTextValue(item.fields.状态)}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 