import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { images, metadata, loras } from "@/lib/schema";
import { eq, desc, like, or, and, count } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(24, Math.max(6, parseInt(searchParams.get("limit") || "12")));
    const search = searchParams.get("search") || "";
    const model = searchParams.get("model") || "";

    const offset = (page - 1) * limit;

    const conditions = [];

    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      conditions.push(
        or(
          like(metadata.positivePrompt, searchTerm),
          like(metadata.negativePrompt || "", searchTerm)
        )
      );
    }

    if (model) {
      conditions.push(eq(metadata.model, model));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 使用count聚合函数替代select all
    const totalResult = await db
      .select({ total: count(images.id) })
      .from(images)
      .leftJoin(metadata, eq(images.id, metadata.imageId))
      .where(whereClause);
    
    const total = totalResult[0]?.total || 0;

    // 优化查询：只选择必要字段，添加索引提示
    const imageList = await db
      .select({
        id: images.id,
        url: images.url,
        filename: images.filename,
        width: images.width,
        height: images.height,
        createdAt: images.createdAt,
        positivePrompt: metadata.positivePrompt,
        model: metadata.model,
        steps: metadata.steps,
      })
      .from(images)
      .leftJoin(metadata, eq(images.id, metadata.imageId))
      .where(whereClause)
      .orderBy(desc(images.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      images: imageList,
      total,
      page,
      limit,
      hasMore: offset + imageList.length < total,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Gallery error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
