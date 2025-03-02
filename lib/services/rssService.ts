/**
 * curl -X POST http://localhost:3000/api/v1/process-rss \
 *   -H "Content-Type: application/json" \
 *   -d '{"url": "https://wx.hhbboo.com/rss/e520930a28cf1ca175bf3463116575b3"}'
 */



import { JinaParser } from '../jinaParser';
import { RecordService } from '../feishu/services/recordService';
import { ENV } from '../feishu/constants/config';
import Parser from 'rss-parser';

interface RssArticle {
  title: string;
  pubDate: string;
  link: string;
  content?: string;
}

interface ProcessError extends Error {
  message: string;
  details?: any;
}

export class RssService {
  private jinaParser: JinaParser;
  private recordService: RecordService;
  private parser: Parser;

  constructor() {
    this.jinaParser = new JinaParser(ENV.JINA_API_KEY!);
    this.recordService = new RecordService(ENV.BASE_ID!, ENV.TABLE_ID!);
    this.parser = new Parser();
  }

  /**
   * 检查文章是否已存在
   */
  private async isArticleExists(article: RssArticle): Promise<{exists: boolean; existingContent?: any}> {
    try {
      // 直接使用链接字符串查询
      const results = await this.recordService.queryRecords({
        filter: {
          conditions: [
            {
              field_name: "链接",
              operator: "is",
              value: [article.link]  // 直接使用链接字符串
            }
          ]
        }
      });

      // 添加调试日志
      console.log(`\n检查文章: ${article.title}`);
      console.log(`链接: ${article.link}`);
      console.log(`匹配记录数: ${results.length}`);
      
      if (results.length > 0) {
        console.log('已存在的记录:', {
          title: results[0].fields.标题,
          link: results[0].fields.链接
        });
      }

      return {
        exists: results.length > 0,
        existingContent: results.length > 0 ? results[0].fields : undefined
      };
    } catch (error) {
      console.error('检查文章存在时出错:', error);
      return { exists: false };
    }
  }

  /**
   * 获取RSS内容
   */
  private async getRssContent(url: string): Promise<RssArticle[]> {
    try {
      const feed = await this.parser.parseURL(url);
      const articles: RssArticle[] = [];

      for (const item of feed.items) {
        if (item.title && item.pubDate && item.link) {
          articles.push({
            title: item.title,
            pubDate: item.pubDate,
            link: item.link,
            content: item.content || item.contentSnippet
          });
        }
      }

      return articles;
    } catch (error) {
      console.error('Error fetching RSS:', error);
      throw error;
    }
  }

  /**
   * 处理RSS文章并保存到飞书
   */
  public async processRssArticles(rssUrl: string) {
    try {
      console.log('\n=== 开始处理RSS订阅 ===');
      console.log(`RSS地址: ${rssUrl}`);

      // 获取RSS文章列表
      const articles = await this.getRssContent(rssUrl);
      console.log(`\n📚 总共获取到 ${articles.length} 篇文章`);

      let processedCount = 0;
      let skippedCount = 0;
      let jinaParseCount = 0;
      let errorCount = 0;

      // 打印所有文章标题
      console.log('\n获取到的文章列表:');
      articles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
      });

      console.log('\n=== 开始处理文章 ===');
      for (const article of articles) {
        try {
          console.log(`\n处理文章: ${article.title}`);
          console.log(`链接: ${article.link}`);
          console.log(`发布时间: ${article.pubDate}`);

          // 检查文章是否已存在
          const { exists, existingContent } = await this.isArticleExists(article);
          
          if (exists) {
            console.log('✓ 文章已存在，跳过处理');
            skippedCount++;
            continue;
          }

          // 只有新文章才进行解析
          console.log('🔄 开始解析文章内容...');
          jinaParseCount++;
          const parsed = await this.jinaParser.parseUrl(article.link);
          console.log('✓ 文章解析完成');

          // 保存到飞书
          console.log('📝 保存到飞书...');
          await this.recordService.createRecord({
            fields: {
              标题: article.title,
              链接: article.link,  // 直接使用链接字符串
              内容: parsed.content || article.content || '',
              摘要: parsed.description || article.content?.slice(0, 200) || '',
              发布时间: new Date(article.pubDate).getTime(),
              来源: 'RSS订阅',
              分类: '公众号',
              状态: '待处理'
            }
          });
          
          console.log('✓ 保存成功');
          processedCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ 处理失败: ${errorMessage}`);
          errorCount++;
          continue;
        }
      }

      // 打印处理统计
      console.log('\n=== 处理完成 ===');
      console.log('📊 处理统计:');
      console.log(`- 总文章数: ${articles.length}`);
      console.log(`- 已存在文章: ${skippedCount}`);
      console.log(`- 新增文章: ${processedCount}`);
      console.log(`- Jina解析次数: ${jinaParseCount}`);
      console.log(`- 处理失败: ${errorCount}`);

      return {
        success: true,
        processedCount,
        skippedCount,
        jinaParseCount,
        errorCount,
        totalCount: articles.length
      };
    } catch (error) {
      console.error('\n❌ 处理过程出错:', error);
      throw error;
    }
  }
} 