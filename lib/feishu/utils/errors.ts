export class FeiShuError extends Error {
  public details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'FeiShuError';
    this.details = details;
  }
} 