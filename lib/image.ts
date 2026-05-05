type PexelsPhoto = {
  src?: {
    landscape?: string;
    large2x?: string;
    large?: string;
    original?: string;
  };
};

type PexelsSearchResponse = {
  photos?: PexelsPhoto[];
};

const imageCache = new Map<string, string>();

const fallbackQueries = ["business presentation", "online course", "social media marketing", "startup team"];
const yogaQueries = [
  "yoga practice natural light",
  "woman stretching yoga studio",
  "pilates wellness training",
  "meditation yoga calm studio",
  "healthy lifestyle yoga"
];

function hasChinese(value: string) {
  return /[\u4e00-\u9fff]/.test(value);
}

function toEnglishQuery(query: string) {
  const text = query.trim();
  const compact = text.replace(/\s+/g, "");

  if (!text) return "business presentation";

  const rules: Array<[RegExp, string]> = [
    [/瑜伽|普拉提|体态|肩颈|腰背|冥想|拉伸|核心|柔韧|放松|身心/, "yoga practice stretching calm natural light wellness"],
    [/美业|美容|皮肤|抗衰|瘦身|轻医美|护理|门店|复购/, "beauty skincare soft light woman spa treatment"],
    [/房地产|地产|楼盘|公寓|别墅|物业|置业|豪宅/, "luxury real estate modern building interior"],
    [/儿童|少儿|亲子|孩子|教育|训练营|启蒙/, "kids education playful classroom bright"],
    [/封面|人物|剪影|商务|导师|讲师|课堂|课程/, "business person online course presentation"],
    [/短视频|抖音|视频号|内容创作|拍摄|剪辑|变现/, "social media content creator marketing"],
    [/增长|流量|获客|转化|成交|数据/, "business growth analytics marketing"],
    [/方法|公式|流程|SOP|路径|实操|步骤/, "productivity strategy workflow"],
    [/案例|学员|办公|团队|辅导/, "business coaching student office"],
    [/痛点|焦虑|混乱|问题|压力/, "stressed entrepreneur planning desk"],
    [/结果|成功|收益|复盘|优化/, "successful startup team growth"],
    [/价格|权益|福利|报名|行动|CTA/, "business deal signing success"],
    [/招商|合作|投资|回报/, "startup investment partnership presentation"],
    [/活动|嘉宾|会场|赞助|传播/, "business conference event audience"]
  ];

  const matched = rules.find(([pattern]) => pattern.test(compact));
  if (matched) return matched[1];

  return hasChinese(text) ? "business presentation" : text;
}

function queryList(query: string) {
  const normalized = toEnglishQuery(query);
  const yogaFirst = /yoga|pilates|wellness|stretching|meditation|瑜伽|普拉提|体态|肩颈|腰背/i.test(query)
    ? yogaQueries
    : [];

  return [...yogaFirst, normalized, ...fallbackQueries].filter((item, index, list) => item && list.indexOf(item) === index);
}

async function searchPexels(query: string, apiKey: string) {
  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "1"
  });

  console.log(`Pexels query: ${query}`);

  const response = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
    headers: {
      Authorization: apiKey
    },
    next: { revalidate: 60 * 60 * 24 }
  });

  console.log(`Pexels status: ${response.status}`);

  if (!response.ok) {
    throw new Error(`Pexels request failed: ${response.status}`);
  }

  const data = (await response.json()) as PexelsSearchResponse;
  const photo = data.photos?.[0];
  const imageUrl = photo?.src?.landscape || photo?.src?.large2x || photo?.src?.large || photo?.src?.original || "";

  if (!imageUrl) {
    throw new Error(`No Pexels image found for query: ${query}`);
  }

  console.log(`Selected image URL: ${imageUrl}`);
  return imageUrl;
}

export async function fetchImageAsBase64(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Image download failed: ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  console.log(`Image downloaded: ${buffer.byteLength} bytes`);
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
}

export async function fetchImageAsDataUri(imageUrl: string): Promise<string> {
  return fetchImageAsBase64(imageUrl);
}

export async function getImage(query: string): Promise<string> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    const message = "Missing PEXELS_API_KEY. Add it to .env.local to enable real external images.";
    console.error(`Pexels failed: ${message}`);
    throw new Error(message);
  }

  const cacheKey = toEnglishQuery(query);

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) as string;
  }

  let lastError: unknown = null;

  for (const pexelsQuery of queryList(query)) {
    try {
      const imageUrl = await searchPexels(pexelsQuery, apiKey);
      const imageData = await fetchImageAsBase64(imageUrl);
      imageCache.set(cacheKey, imageData);
      return imageData;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "Unknown image error";
      console.error(`Pexels failed: ${message}`);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to load Pexels image");
}

export async function fetchImage(query: string): Promise<string> {
  return getImage(query);
}
