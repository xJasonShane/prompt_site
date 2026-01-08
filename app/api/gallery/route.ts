import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { images, metadata, loras } from "@/lib/schema";
import { eq, desc, like, or, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const model = searchParams.get("model") || "";

    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(metadata.positivePrompt, `%${search}%`),
          like(metadata.negativePrompt || "", `%${search}%`)
        )
      );
    }

    if (model) {
      conditions.push(eq(metadata.model, model));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const imageList = await db
      .select({
        id: images.id,
        url: images.url,
        filename: images.filename,
        width: images.width,
        height: images.height,
        createdAt: images.createdAt,
        positivePrompt: metadata.positivePrompt,
        negativePrompt: metadata.negativePrompt,
        model: metadata.model,
        version: metadata.version,
        steps: metadata.steps,
        cfg: metadata.cfg,
        seed: metadata.seed,
        sampler: metadata.sampler,
      })
      .from(images)
      .leftJoin(metadata, eq(images.id, metadata.imageId))
      .where(whereClause)
      .orderBy(desc(images.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: images.id })
      .from(images)
      .leftJoin(metadata, eq(images.id, metadata.imageId))
      .where(whereClause);

    return NextResponse.json({
      images: imageList,
      total: totalCount.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Gallery error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
