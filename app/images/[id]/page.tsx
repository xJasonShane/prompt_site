"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download } from "lucide-react";

interface Lora {
  name: string;
  weight: number;
}

interface ImageDetail {
  id: string;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  positivePrompt: string;
  negativePrompt: string;
  model: string;
  version: string;
  steps: number;
  cfg: number;
  seed: number;
  sampler: string;
  loras: Lora[];
}

export default function ImageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [image, setImage] = useState<ImageDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/images/${params.id}`);
        const data = await res.json();
        setImage(data);
      } catch (error) {
        console.error("Failed to fetch image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [params.id]);

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板");
  };

  const downloadImage = async () => {
    if (!image) return;
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = image.filename || "image.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              图片不存在
            </p>
            <Link href="/gallery" className="mt-4 inline-block">
              <Button>返回图库</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/gallery">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回图库
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.positivePrompt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={downloadImage} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    下载图片
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>提示词</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">正向提示词</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {image.positivePrompt}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyPrompt(image.positivePrompt)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                </div>
                {image.negativePrompt && (
                  <div>
                    <h3 className="font-semibold mb-2">负向提示词</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {image.negativePrompt}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPrompt(image.negativePrompt)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>生成参数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">模型:</span>
                    <p className="font-medium">{image.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">版本:</span>
                    <p className="font-medium">{image.version || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">步数:</span>
                    <p className="font-medium">{image.steps}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">CFG:</span>
                    <p className="font-medium">{image.cfg}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">种子:</span>
                    <p className="font-medium">{image.seed}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">采样器:</span>
                    <p className="font-medium">{image.sampler}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">尺寸:</span>
                    <p className="font-medium">
                      {image.width} x {image.height}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {image.loras && image.loras.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>LoRA模型</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {image.loras.map((lora, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <span className="text-sm">{lora.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {lora.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
