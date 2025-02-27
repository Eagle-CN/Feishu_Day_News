import { TableResponse, NewsItem } from '@/types';

// 使用正确的API端点
const BASE_URL = 'https://open.feishu.cn/open-apis/bitable/v1';

// 获取飞书访问令牌
export async function getAccessToken() {
  console.log('Getting access token with:', {
    app_id: process.env.FEISHU_APP_ID,
    app_secret: '***' + process.env.FEISHU_APP_SECRET?.slice(-4),
  });

  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }),
  });

  const responseText = await response.text();
  console.log('Token response:', responseText);

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('Failed to parse token response:', e);
    throw new Error('Invalid token response');
  }

  if (!data.tenant_access_token) {
    console.error('Failed to get access token:', data);
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }

  console.log('Got access token:', {
    token: data.tenant_access_token?.slice(0, 10) + '***',
    expire: data.expire,
  });

  return data.tenant_access_token;
}

// 获取表格列表
export async function getTables() {
  const token = await getAccessToken();
  
  const response = await fetch(
    `${BASE_URL}/apps/${process.env.FEISHU_BASE_ID}/tables`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const data = await response.json();
  console.log('Tables:', data);
  return data;
}

// 获取表格数据
export async function getTableData(pageToken?: string): Promise<TableResponse> {
  const token = await getAccessToken();
  
  const url = new URL(
    `${BASE_URL}/apps/${process.env.FEISHU_BASE_ID}/tables/${process.env.FEISHU_TABLE_ID}/records`
  );
  
  url.searchParams.set('page_size', '100');
  if (pageToken) {
    url.searchParams.set('page_token', pageToken);
  }

  console.log('Requesting URL:', url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const data = await response.json();
  console.log('API Response:', data);

  if (data.code !== 0) {
    throw new Error(`API error: ${data.msg}`);
  }

  return data;
}

// 修改权限检查函数为导出函数
export async function checkAuth() {
  try {
    const token = await getAccessToken();
    console.log('Got access token:', token);
    
    // 测试权限
    const response = await fetch(
      `${BASE_URL}/apps/${process.env.FEISHU_BASE_ID}/tables/${process.env.FEISHU_TABLE_ID}/records?page_size=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('Auth check response:', data);
    return data;
  } catch (error) {
    console.error('Auth check failed:', error);
    throw error;
  }
}

// 添加新的链接到表格
export async function addLink(url: string) {
  const token = await getAccessToken();
  console.log('Using token:', token.slice(0, 10) + '***');
  
  const apiUrl = `${BASE_URL}/apps/${process.env.FEISHU_BASE_ID}/tables/${process.env.FEISHU_TABLE_ID}/records`;
  console.log('API URL:', apiUrl);

  const requestBody = {
    fields: {
      "标题": url,  // 暂时用 URL 作为标题
      "链接": {     // URL 字段需要特殊格式
        "text": url,
        "type": "url",
        "link": url
      }
    }
  };

  // 打印请求详情
  console.log('Request details:', {
    url: apiUrl,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.slice(0, 10)}***`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody, null, 2)
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        url: apiUrl,
        token: token.slice(0, 10) + '***'
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid JSON response');
    }

    console.log('Add link response:', data);
    
    if (data.code !== 0) {
      throw new Error(`Failed to add link: ${data.msg}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to add link:', {
      error: error.message,
      url: apiUrl,
      token: token.slice(0, 10) + '***',
      body: requestBody
    });
    throw error;
  }
}

// 获取所有新闻数据
export async function getAllNews(): Promise<NewsItem[]> {
  let allNews: NewsItem[] = [];
  let pageToken: string | undefined;
  
  try {
    do {
      const response = await getTableData(pageToken);
      
      if (!response.data?.items) {
        console.error('Invalid response structure:', response);
        break;
      }

      const items = Array.isArray(response.data.items) ? response.data.items : [];
      allNews = [...allNews, ...items];
      
      pageToken = response.data.page_token;
      
      if (!response.data.has_more) {
        break;
      }
    } while (pageToken);

    return allNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// 添加调试函数
export async function debugPermissions() {
  try {
    // 0. 检查环境变量
    const envCheck = {
      FEISHU_APP_ID: process.env.FEISHU_APP_ID,
      FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET?.slice(0, 4) + '***',
      FEISHU_BASE_ID: process.env.FEISHU_BASE_ID,
      FEISHU_TABLE_ID: process.env.FEISHU_TABLE_ID,
    };
    console.log('Environment variables:', envCheck);

    const token = await getAccessToken();
    
    // 1. 检查应用信息
    const appResponse = await fetch(
      'https://open.feishu.cn/open-apis/application/v6/applications/info?lang=zh_cn',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let appData;
    try {
      const appText = await appResponse.text();
      console.log('Raw App Response:', appText);
      appData = JSON.parse(appText);
    } catch (e) {
      console.error('Failed to parse app response:', e);
      appData = { error: 'Failed to parse response' };
    }

    // 2. 检查租户访问令牌
    const tokenResponse = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: process.env.FEISHU_APP_ID,
          app_secret: process.env.FEISHU_APP_SECRET,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    console.log('Token Response:', {
      ...tokenData,
      tenant_access_token: tokenData.tenant_access_token ? '***' : undefined,
    });

    return {
      env: envCheck,
      token: tokenData,
      app: appData,
    };
  } catch (error) {
    console.error('Debug check failed:', error);
    return {
      error: error.message,
      stack: error.stack,
    };
  }
}

// 获取所有可用的表格
export async function listTables() {
  const token = await getAccessToken();
  
  const response = await fetch(
    `${BASE_URL}/apps/${process.env.FEISHU_BASE_ID}/tables?lang=zh_cn`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const data = await response.json();
  console.log('Tables list:', data);
  return data;
}

// 创建新的数据表
export async function createTable() {
  const token = await getAccessToken();
  console.log('Using token:', token.slice(0, 10) + '***');
  
  const apiUrl = `${BASE_URL}/apps/${process.env.FEISHU_BASE_ID}/tables`;
  console.log('API URL:', apiUrl);

  const requestBody = {
    table: {
      name: "新闻采集",
      default_view_name: "默认视图",
      fields: [
        {
          field_name: "标题",
          type: 1,  // 文本类型
          ui_type: "Text"
        },
        {
          field_name: "链接",
          type: 1,  // 文本类型
          ui_type: "Url",
          property: {
            formatter: "url"
          }
        },
        {
          field_name: "内容",
          type: 1,  // 文本类型
          ui_type: "Text",
          property: {
            formatter: "rich"
          }
        },
        {
          field_name: "摘要",
          type: 1,  // 文本类型
          ui_type: "Text"
        },
        {
          field_name: "发布时间",
          type: 5,  // 日期时间类型
          ui_type: "DateTime"
        },
        {
          field_name: "来源",
          type: 3,  // 单选类型
          ui_type: "SingleSelect",
          property: {
            options: [
              { name: "36氪", color: 0 },
              { name: "cnBeta", color: 1 },
              { name: "其他", color: 2 }
            ]
          }
        },
        {
          field_name: "分类",
          type: 3,  // 单选类型
          ui_type: "SingleSelect",
          property: {
            options: [
              { name: "科技", color: 0 },
              { name: "创投", color: 1 },
              { name: "其他", color: 2 }
            ]
          }
        },
        {
          field_name: "状态",
          type: 3,  // 单选类型
          ui_type: "SingleSelect",
          property: {
            options: [
              { name: "待处理", color: 0 },
              { name: "处理中", color: 1 },
              { name: "已完成", color: 2 }
            ]
          }
        },
        {
          field_name: "关键词",
          type: 4,  // 多选类型
          ui_type: "MultiSelect",
          property: {
            options: [
              { name: "AI", color: 0 },
              { name: "创业", color: 1 },
              { name: "融资", color: 2 }
            ]
          }
        }
      ]
    }
  };
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        url: apiUrl,
        token: token.slice(0, 10) + '***'
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid JSON response');
    }

    console.log('Create table response:', data);
    
    if (data.code !== 0) {
      throw new Error(`Failed to create table: ${data.msg}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to create table:', {
      error: error.message,
      url: apiUrl,
      token: token.slice(0, 10) + '***',
      body: requestBody
    });
    throw error;
  }
} 