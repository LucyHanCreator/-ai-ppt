import { NextRequest, NextResponse } from "next/server";
import { buildPptx } from "@/lib/ppt";
import { generatePptFileRequestSchema } from "@/lib/schema";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

function safeFileName(value: string) {
  return value
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = generatePptFileRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid outline body." }, { status: 400 });
  }

  const { outline, generationId } = parsed.data;
  const supabase = getSupabaseAdmin();

  try {
    const buffer = await buildPptx(outline);

    if (supabase && generationId) {
      await supabase
        .from("ppt_generations")
        .update({
          status: "completed",
          outline_json: outline
        })
        .eq("id", generationId);
    }

    const filename = `${safeFileName(outline.title) || "ai-ppt"}.pptx`;
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate PPTX.";

    if (supabase && generationId) {
      await supabase
        .from("ppt_generations")
        .update({
          status: "failed",
          error_message: message
        })
        .eq("id", generationId);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
