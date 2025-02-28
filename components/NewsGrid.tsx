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

// 添加辅助函数
function getSourceIcon(source: any): string {
  if (typeof source !== 'string') return '📱';
  if (source.includes('36氪')) return '⚡️';
  if (source.includes('cnBeta')) return '🌐';
  return '📱';
}

export default function NewsGrid({ news }: NewsGridProps) {
  const today = new Date();
  
  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-screen">
      {/* 顶部导航区域 */}
      <div className="flex justify-center mb-8">
        <span className="bg-[#2d1d38] text-[#a78bfa] px-4 py-1 rounded-full text-sm">
          Showcase
        </span>
      </div>

      {/* 标题区域 */}
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#ec4899] inline-block text-transparent bg-clip-text">
          资讯早知道
        </h1>
        <p className="text-gray-400">
          每日数据定时更新，减少信息差。
        </p>
      </div>

      {/* 主标题和日期 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl text-white font-medium mb-2 flex items-center justify-center gap-2">
          ProductHunt 今天发布了什么产品
          <span className="text-2xl">🔥</span>
          <span className="text-white">
            2024-12-20
          </span>
        </h2>
      </div>

      {/* 工具栏 */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className="text-gray-300 text-sm">轮播图</span>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm text-white bg-transparent border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
            <span className="i-carbon-copy"></span>
            复制
          </button>
          <button className="px-4 py-2 text-sm text-white bg-transparent border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
            <span className="i-carbon-download"></span>
            下载
          </button>
        </div>
      </div>

      {/* 内容卡片 */}
      <div className="bg-[#ff6154] p-6 rounded-3xl">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* 卡片头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ff6154] rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">ProductHunt发布</span>
                </div>
                <div className="text-sm text-gray-500">
                  ProductHunt 今天发布了什么产品🔥
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-[#ff6154] text-white rounded-t-lg px-4 py-1 text-center">
                <div className="text-xs font-medium leading-none">12月</div>
              </div>
              <div className="bg-white text-[#ff6154] rounded-b-lg px-4 py-1 text-center border-2 border-t-0 border-[#ff6154]">
                <div className="text-2xl font-bold leading-none">20</div>
              </div>
            </div>
          </div>

          {/* 卡片内容 */}
          <div className="p-6 bg-[#fff8f8]">
            {news.filter(item => Object.keys(item.fields).length > 0).map((item) => (
              <article 
                key={item.record_id} 
                className="bg-white rounded-2xl mb-4 p-6 hover:bg-[#fff1f1] transition-all border border-[#ffe4e4]"
              >
                <div className="flex items-start gap-4">
                  {/* 左侧图标 */}
                  <div className="flex-shrink-0 w-12 h-12 bg-[#f8f8f8] rounded-xl flex items-center justify-center">
                    <span className="text-2xl">
                      {getSourceIcon(item.fields.来源)}
                    </span>
                  </div>

                  {/* 主要内容 */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        <a 
                          href={getLinkValue(item.fields.链接 as string | FeishuLink)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-[#ff6154] transition-colors"
                        >
                          {getTextValue(item.fields.标题)}
                        </a>
                      </h3>
                      <span className="text-xs text-gray-500">✨</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {getTextValue(item.fields.摘要)}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {item.fields.分类 && (
                        <span className="px-3 py-1 bg-[#fff8f8] text-gray-600 rounded-full text-xs">
                          {getTextValue(item.fields.分类)}
                        </span>
                      )}
                      {getTags(item.fields.关键词).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-[#fff8f8] text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 右侧数据 */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="bg-[#f8f8f8] rounded-lg px-4 py-2 flex flex-col items-center">
                      <div className="text-sm font-medium text-gray-900 leading-none mb-1">▲</div>
                      <div className="text-xs text-gray-500 leading-none">
                        {new Date(item.fields.发布时间 as number).toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 卡片底部 */}
          <div className="p-4 border-t border-gray-100 text-center">
            <div className="text-sm text-gray-500">
              Generated by <span className="text-[#ff6154]">Tweeze.app</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Craft your personal newsletter with AI
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Generated by <a href="https://tweeze.app" target="_blank" rel="noopener noreferrer" className="text-[#ff6154] hover:underline">Tweeze.app</a></p>
        <p className="mt-1 text-xs text-gray-400">Craft your personal newsletter with AI</p>
      </div>
    </div>
  );
} 