import { WechatService } from './wechatService';
import { JinaParser } from '../jinaParser';
import { RecordService } from '../feishu/services/recordService';
import { ENV } from '../feishu/constants/config';

export class SchedulerService {
  private wechatService: WechatService;
  private jinaParser: JinaParser;
  private recordService: RecordService;

  constructor() {
    this.wechatService = new WechatService([
      // 配置要监控的公众号列表
      'account1',
      'account2'
    ]);
    this.jinaParser = new JinaParser(ENV.JINA_API_KEY);
    this.recordService = new RecordService(ENV.BASE_ID!, ENV.TABLE_ID!);
  }

  async processArticles() {
    try {
      // 1. 获取最新文章
      const articles = await this.wechatService.getLatestArticles();

      // 2. 解析文章内容
      const processedArticles = await Promise.all(
        articles.map(async article => {
          const parsed = await this.jinaParser.parseUrl(article.link);
          return {
            fields: {
              标题: parsed.title,
              链接: {
                text: parsed.url,
                link: parsed.url,
                type: 'url'
              },
              内容: parsed.content,
              摘要: parsed.description,
              发布时间: new Date(article.pubDate).getTime(),
              来源: article.account,
              分类: '公众号',
              状态: '待处理'
            }
          };
        })
      );

      // 3. 批量上传到飞书
      if (processedArticles.length > 0) {
        await this.recordService.batchCreateRecords({
          records: processedArticles
        });
      }

      console.log(`Successfully processed ${processedArticles.length} articles`);
    } catch (error) {
      console.error('Error processing articles:', error);
    }
  }
} 