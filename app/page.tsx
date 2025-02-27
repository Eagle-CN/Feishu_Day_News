import { getAllNews } from '@/lib/feishu';
import NewsGrid from '@/components/NewsGrid';

export const revalidate = 3600; // 每小时重新验证数据

export default async function Home() {
  const news = await getAllNews();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">每日新闻汇总</h1>
      <NewsGrid news={news} />
    </main>
  );
} 