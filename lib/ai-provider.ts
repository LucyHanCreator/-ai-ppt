import OpenAI from "openai";

type Provider = "openai" | "kimi";

type JsonSchemaFormat = {
  name: string;
  strict?: boolean;
  schema: { [key: string]: unknown };
};

type GenerateJsonInput = {
  instructions: string;
  input: string;
  schema: JsonSchemaFormat;
  region?: string;
};

function resolveProvider(region?: string): Provider {
  if (region === "china") return "kimi";
  return process.env.MODEL_PROVIDER === "kimi" ? "kimi" : "openai";
}

function openaiClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export function getActiveModel(region?: string) {
  return resolveProvider(region) === "kimi"
    ? process.env.KIMI_MODEL || "moonshot-v1-8k"
    : process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function hasAiProviderKey(region?: string) {
  return resolveProvider(region) === "kimi" ? Boolean(process.env.KIMI_API_KEY) : Boolean(process.env.OPENAI_API_KEY);
}

export async function callOpenAI(prompt: string) {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const response = await openaiClient().responses.create({
    model: getActiveModel("global"),
    input: prompt
  });

  return response.output_text;
}

export async function callKimi(prompt: string) {
  if (!process.env.KIMI_API_KEY) throw new Error("Missing KIMI_API_KEY");

  const baseUrl = process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1";
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.KIMI_API_KEY}`
    },
    body: JSON.stringify({
      model: getActiveModel("china"),
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    throw new Error(`Kimi request failed: ${response.status}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content || "";
}

export async function generateContent(prompt: string, region?: string) {
  if (resolveProvider(region) === "kimi") {
    return callKimi(prompt);
  }

  return callOpenAI(prompt);
}

export async function generateJsonContent({ instructions, input, schema, region }: GenerateJsonInput) {
  if (resolveProvider(region) === "kimi") {
    const prompt = [
      instructions,
      "Return only valid JSON. Do not include markdown fences.",
      "The JSON must match this schema:",
      JSON.stringify(schema.schema),
      "User input:",
      input
    ].join("\n\n");

    const content = await callKimi(prompt);
    return content.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  }

  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const response = await openaiClient().responses.create({
    model: getActiveModel(region),
    instructions,
    input: [
      {
        role: "user",
        content: [{ type: "input_text", text: input }]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: schema.name,
        strict: schema.strict ?? true,
        schema: schema.schema
      }
    }
  });

  return response.output_text;
}
