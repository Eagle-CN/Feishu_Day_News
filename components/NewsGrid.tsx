'use client';

import { NewsItem } from '@/types';
import { useState } from 'react';

interface NewsGridProps {
  news: NewsItem[];
}

export default function NewsGrid({ news }: NewsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <article 
          key={item.record_id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">
              {item.fields.标题}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {item.fields.摘要}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(item.fields.创建时间).toLocaleDateString()}
              </span>
              <a
                href={item.fields.链接}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                阅读原文
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 