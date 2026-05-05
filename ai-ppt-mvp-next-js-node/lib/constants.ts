import type { PptType } from "@/lib/types";

export const PPT_TYPES: Record<PptType, { label: string; description: string; accent: string }> = {
  investment: {
    label: "\u62db\u5546PPT",
    description: "\u9002\u5408\u9879\u76ee\u878d\u8d44\u3001\u5e73\u53f0\u62db\u5546\u3001\u5546\u4e1a\u5408\u4f5c\u4e0e\u8d44\u6e90\u6d3d\u8c08\u3002",
    accent: "#1d4ed8"
  },
  course: {
    label: "\u8bfe\u7a0bPPT",
    description: "\u9002\u5408\u57f9\u8bad\u8bfe\u7a0b\u3001\u77e5\u8bc6\u4ed8\u8d39\u3001\u4f01\u4e1a\u5185\u8bad\u548c\u516c\u5f00\u8bfe\u3002",
    accent: "#047857"
  },
  event: {
    label: "\u6d3b\u52a8PPT",
    description: "\u9002\u5408\u53d1\u5e03\u4f1a\u3001\u6c99\u9f99\u5cf0\u4f1a\u3001\u54c1\u724c\u6d3b\u52a8\u4e0e\u9879\u76ee\u63a8\u4ecb\u3002",
    accent: "#b45309"
  }
};

export const PPT_TYPE_OPTIONS = Object.entries(PPT_TYPES).map(([value, item]) => ({
  value: value as PptType,
  ...item
}));
