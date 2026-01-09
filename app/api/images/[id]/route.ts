import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { images, metadata, loras } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const imageData = await db
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
        metadataId: metadata.id,
      })
      .from(images)
      .leftJoin(metadata, eq(images.id, metadata.imageId))
      .where(eq(images.id, id))
      .limit(1);

    if (!imageData.length) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const image = imageData[0];

    // 只有当metadataId存在时才查询LoRA数据
    let lorasData: typeof loras.$inferSelect[] = [];
    if (image.metadataId) {
      lorasData = await db
        .select()
        .from(loras)
        .where(eq(loras.metadataId, image.metadataId));
    }

    return NextResponse.json({
      ...image,
      loras: lorasData,
    });
  } catch (error) {
    console.error("Image detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image details" },
      { status: 500 }
    );
  }
}
