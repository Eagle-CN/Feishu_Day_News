import { SchedulerService } from './schedulerService';

export class CronService {
  private scheduler: SchedulerService;

  constructor() {
    this.scheduler = new SchedulerService();
  }

  async processArticles() {
    try {
      await this.scheduler.processArticles();
      return { success: true };
    } catch (error) {
      console.error('Cron job failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  }
} 