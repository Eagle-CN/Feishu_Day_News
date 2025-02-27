export interface ParsedContent {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedTime: string;
  error?: string;
}

export interface JinaResponse {
  code: number;
  status: number;
  data: {
    text: string;
    title: string;
    description: string;
    url: string;
    publishedTime: string;
    usage: {
      tokens: number;
    }
  }
} 