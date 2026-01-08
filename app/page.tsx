export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI绘图元数据管理
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            轻松管理和查看AI生成图片的元数据信息
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/upload"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              上传图片
            </a>
            <a
              href="/gallery"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              浏览图库
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
