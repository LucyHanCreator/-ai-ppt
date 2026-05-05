export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const topic = body?.topic || "默认主题";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `
请生成一个简洁的PPT大纲：

主题：${topic}

要求：
1. 控制在8页以内
2. 每页格式：
   标题：
   描述：
3. 每页描述不超过20字
4. 输出简洁
        `
      })
    });

    const data = await response.json();

    const text =
      data?.output?.[0]?.content?.[0]?.text || "生成失败";

    return new Response(
      JSON.stringify({
        success: true,
        content: text
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500 }
    );
  }
}
