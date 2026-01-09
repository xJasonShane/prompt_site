'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, HomeIcon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <ImageIcon className="h-6 w-6" />
            <span>AI绘图元数据</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span>首页</span>
            </Link>
            
            <Link href="/gallery" className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ImageIcon className="h-4 w-4" />
              <span>图库</span>
            </Link>
            
            <Link href="/upload">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>上传图片</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
