export const maxDuration = 60; // 最大60秒（防止被提前杀掉）

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ⚡ 快模型（关键）
        input: `
请生成一个简洁的PPT大纲：

主题：${topic}

要求：
1. 控制在8页以内
2. 每页格式：
   标题：
   描述：
3. 每页描述不超过20字
4. 不要长段落
5. 输出简洁清晰
        `
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      content: data.output[0].content[0].text
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500
    });
  }
}
