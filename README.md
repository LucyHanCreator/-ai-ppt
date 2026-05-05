# AI 商业 PPT 生成器 MVP

第一版只做最小可运行闭环：用户填写需求，系统生成结构化 PPT 大纲，再生成并下载 PPTX 文件。

不包含登录、支付、会员、复杂模板。

## 1. 项目目录结构

完整结构与核心文件说明见：

- `docs/project-structure.md`

核心运行链路：

```text
app/page.tsx
  -> app/generate/page.tsx
  -> components/GenerateForm.tsx
  -> app/api/generate-outline/route.ts
  -> app/api/generate-ppt/route.ts
  -> lib/pptx.ts
```

## 2. 环境变量配置

在项目根目录创建 `.env.local`：

```bash
OPENAI_API_KEY=sk-proj_xxx
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

字段说明：

| 字段 | 是否必填 | 作用 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 必填 | 调用 OpenAI API 生成结构化 PPT JSON。 |
| `NEXT_PUBLIC_SUPABASE_URL` | 可选 | Supabase 项目 URL。配置后可保存生成记录。 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 可选 | 浏览器侧 Supabase 公钥。第一版暂未直接使用，先保留部署配置。 |
| `SUPABASE_SERVICE_ROLE_KEY` | 可选 | 服务端写入 `ppt_generations` 表。不要暴露到浏览器。 |

如果只想先跑通 PPTX 下载，最低只需要配置 `OPENAI_API_KEY`。

## 3. 本地运行步骤

### 安装依赖

```bash
npm install
```

### 初始化 Supabase

1. 创建 Supabase 项目。
2. 打开 Project Settings -> API。
3. 复制 Project URL、anon key、service role key 到 `.env.local`。
4. 打开 Supabase SQL Editor。
5. 执行 `supabase/schema.sql`。

Supabase 暂时不配置也可以运行，只是不保存生成记录。

### 启动本地项目

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

### 测试生成 PPTX

1. 进入首页。
2. 点击“填写需求”。
3. 选择 PPT 类型：招商 PPT、课程 PPT 或活动 PPT。
4. 填写主题、目标受众、PPT 目标、风格、页数和补充需求。
5. 点击“生成并下载 PPTX”。
6. 浏览器会下载 `.pptx` 文件。

## 4. 最小可运行版本代码

已实现：

- 首页：`app/page.tsx`
- 需求表单页：`app/generate/page.tsx`
- 生成结构化大纲：`app/api/generate-outline/route.ts`
- 生成 PPTX 文件：`app/api/generate-ppt/route.ts`
- PPTX 下载：`components/GenerateForm.tsx`

API 设计见：

- `docs/api-design.md`

API 测试步骤见：

- `docs/test-guide.md`

数据库设计见：

- `docs/database-design.md`
