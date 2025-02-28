import { getAllNews } from '@/lib/feishu';
import NewsGrid from '@/components/NewsGrid';

// 禁用所有缓存
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const news = await getAllNews({
    pageSize: 100,
    sort: [{ field_name: "发布时间", desc: true }]
  });
  
  console.log('News data in page:', JSON.stringify(news, null, 2)); // 添加日志
  
  return (
    <main className="min-h-screen bg-[#1c1c1c] py-12">
      <div className="container mx-auto px-4">
        <NewsGrid news={news} />
      </div>
    </main>
  );
} 