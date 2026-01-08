import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/storage";
import { db } from "@/lib/db";
import { images, metadata, loras } from "@/lib/schema";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const positivePrompt = formData.get("positivePrompt") as string;
    const negativePrompt = formData.get("negativePrompt") as string;
    const model = formData.get("model") as string;
    const version = formData.get("version") as string;
    const steps = parseInt(formData.get("steps") as string);
    const cfg = parseInt(formData.get("cfg") as string);
    const seed = parseInt(formData.get("seed") as string);
    const sampler = formData.get("sampler") as string;
    const width = parseInt(formData.get("width") as string);
    const height = parseInt(formData.get("height") as string);
    const lorasData = formData.get("loras") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileId = nanoid();
    const filename = `${fileId}-${file.name}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageId = nanoid();
    const imageUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${filename}`;

    await db.insert(images).values({
      id: imageId,
      userId: session.user.id,
      url: imageUrl,
      filename,
      size: file.size,
      width,
      height,
      createdAt: new Date(),
    });

    const metadataId = nanoid();
    await db.insert(metadata).values({
      id: metadataId,
      imageId,
      positivePrompt,
      negativePrompt,
      model,
      version,
      steps,
      cfg,
      seed,
      sampler,
      width,
      height,
      createdAt: new Date(),
    });

    if (lorasData) {
      const loras = JSON.parse(lorasData);
      for (const lora of loras) {
        await db.insert(loras).values({
          id: nanoid(),
          metadataId,
          name: lora.name,
          weight: lora.weight,
        });
      }
    }

    return NextResponse.json({
      success: true,
      imageId,
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
