"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Upload, ArrowLeft } from "lucide-react";

interface ImageData {
  id: string;
  url: string;
  width: number;
  height: number;
  positivePrompt: string;
  negativePrompt: string;
  model: string;
  version: string;
  steps: number;
  cfg: number;
  seed: number;
  sampler: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = useCallback(async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/gallery?search=${encodeURIComponent(searchTerm)}&page=${pageNum}&limit=12`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        }
      );
      
      if (!res.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await res.json();

      if (pageNum === 1) {
        setImages(data.images);
      } else {
        setImages((prev) => [...prev, ...data.images]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      // 可以添加错误状态处理
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(search, 1);
    setPage(1);
  }, [search, fetchImages]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(search, nextPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            图片库
          </h1>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <Link href="/upload">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                上传图片
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="搜索提示词..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading && images.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              暂无图片，上传第一张图片吧！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <Link key={image.id} href={`/images/${image.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.positivePrompt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {image.positivePrompt}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{image.model}</span>
                        <span>{image.steps} steps</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {hasMore && !loading && images.length > 0 && (
          <div className="text-center mt-8">
            <Button onClick={loadMore} variant="outline">
              加载更多
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
