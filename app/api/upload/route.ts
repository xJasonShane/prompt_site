import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/storage";
import { db } from "@/lib/db";
import { images, metadata, loras } from "@/lib/schema";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// 验证函数
const validateFile = (file: File) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, WebP and GIF are allowed');
  }
};

const validateMetadata = (data: any) => {
  const requiredFields = ['positivePrompt', 'model', 'steps', 'cfg', 'seed', 'sampler', 'width', 'height'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }
  
  // 验证数值类型
  const numericFields = ['steps', 'cfg', 'seed', 'width', 'height'];
  for (const field of numericFields) {
    if (isNaN(Number(data[field]))) {
      throw new Error(`${field} must be a number`);
    }
  }
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    // 提取元数据
    const metadataFields = {
      positivePrompt: formData.get("positivePrompt") as string,
      negativePrompt: formData.get("negativePrompt") as string,
      model: formData.get("model") as string,
      version: formData.get("version") as string,
      steps: parseInt(formData.get("steps") as string),
      cfg: parseInt(formData.get("cfg") as string),
      seed: parseInt(formData.get("seed") as string),
      sampler: formData.get("sampler") as string,
      width: parseInt(formData.get("width") as string),
      height: parseInt(formData.get("height") as string),
      lorasData: formData.get("loras") as string,
    };

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 验证文件和元数据
    validateFile(file);
    validateMetadata(metadataFields);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileId = nanoid();
    const filename = `${fileId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 上传到R2存储
    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000',
      })
    );

    const imageId = nanoid();
    const imageUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${filename}`;

    // 直接插入，不使用事务（简化类型问题）
    
    // 插入图片记录 - 所有字段都是必填的
    await db.insert(images).values({
      id: imageId,
      userId: session.user.id,
      url: imageUrl,
      filename: filename,
      size: file.size,
      width: Number(metadataFields.width),
      height: Number(metadataFields.height),
      createdAt: new Date(),
    } as any); // 暂时使用类型断言解决类型问题

    // 插入元数据记录
    const metadataId = nanoid();
    await db.insert(metadata).values({
      id: metadataId,
      imageId: imageId,
      positivePrompt: metadataFields.positivePrompt,
      negativePrompt: metadataFields.negativePrompt || null,
      model: metadataFields.model,
      version: metadataFields.version || null,
      steps: Number(metadataFields.steps),
      cfg: Number(metadataFields.cfg),
      seed: Number(metadataFields.seed),
      sampler: metadataFields.sampler,
      width: Number(metadataFields.width),
      height: Number(metadataFields.height),
      createdAt: new Date(),
    } as any); // 暂时使用类型断言解决类型问题

    // 插入LoRA数据（如果有）
    if (metadataFields.lorasData) {
      try {
        const lorasArray = JSON.parse(metadataFields.lorasData);
        if (Array.isArray(lorasArray)) {
          for (const lora of lorasArray) {
            if (lora.name && typeof lora.weight === 'number') {
              await db.insert(loras).values({
                id: nanoid(),
                metadataId: metadataId,
                name: lora.name,
                weight: Number(lora.weight),
              } as any); // 暂时使用类型断言解决类型问题
            }
          }
        }
      } catch (e) {
        console.error("Invalid loras data:", e);
      }
    }

    return NextResponse.json({
      success: true,
      imageId,
      imageUrl,
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: error.message ? 400 : 500 }
    );
  }
}
