"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

interface Lora {
  name: string;
  weight: number;
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loras, setLoras] = useState<Lora[]>([]);
  const [currentLora, setCurrentLora] = useState<Lora>({ name: "", weight: 50 });
  const [customSampler, setCustomSampler] = useState("");
  const [selectedSampler, setSelectedSampler] = useState("DPM++ 2M Karras");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 如果选择了"其他"，将自定义输入的值赋值给表单
    if (selectedSampler === "其他") {
      const samplerInput = e.currentTarget.elements.namedItem("sampler") as HTMLInputElement;
      if (samplerInput) {
        samplerInput.value = customSampler;
      }
    }
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("loras", JSON.stringify(loras));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/gallery");
      } else {
        alert("上传失败");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 文件验证
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      
      if (selectedFile.size > maxSize) {
        alert(`文件大小不能超过${maxSize / 1024 / 1024}MB`);
        return;
      }
      
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('只允许上传 JPG、PNG、WebP 和 GIF 格式的图片');
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        // 生成压缩预览图，减少内存占用
        const img = new (window.Image)();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxPreviewSize = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxPreviewSize) {
            height = Math.round((height * maxPreviewSize) / width);
            width = maxPreviewSize;
          } else if (height > maxPreviewSize) {
            width = Math.round((width * maxPreviewSize) / height);
            height = maxPreviewSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setPreview(canvas.toDataURL('image/jpeg', 0.8));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const addLora = () => {
    if (currentLora.name) {
      setLoras([...loras, currentLora]);
      setCurrentLora({ name: "", weight: 50 });
    }
  };

  const removeLora = (index: number) => {
    setLoras(loras.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          上传AI绘图
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>图片与元数据</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="file">选择图片</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  {preview ? (
                    <div className="relative">
                      <div className="relative w-full max-h-96 mx-auto">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-contain rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPreview("");
                          setFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        拖拽图片到此处或点击选择
                      </p>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="positivePrompt">正向提示词</Label>
                <Textarea
                  id="positivePrompt"
                  name="positivePrompt"
                  placeholder="描述你想要生成的图片内容..."
                  required
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="negativePrompt">负向提示词</Label>
                <Textarea
                  id="negativePrompt"
                  name="negativePrompt"
                  placeholder="描述你不希望出现的内容..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model">AI模型</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="例如: Stable Diffusion XL"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="version">版本</Label>
                  <Input
                    id="version"
                    name="version"
                    placeholder="例如: 1.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="steps">步数</Label>
                  <Input
                    id="steps"
                    name="steps"
                    type="number"
                    defaultValue={20}
                    min={1}
                    max={150}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cfg">CFG Scale</Label>
                  <Input
                    id="cfg"
                    name="cfg"
                    type="number"
                    defaultValue={7}
                    min={1}
                    max={30}
                    step={0.5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seed">种子</Label>
                  <Input
                    id="seed"
                    name="seed"
                    type="number"
                    defaultValue={-1}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sampler">采样器</Label>
                  <Select 
                    name="sampler" 
                    defaultValue="DPM++ 2M Karras" 
                    required
                    onValueChange={(value) => {
                      setSelectedSampler(value);
                      // 如果选择了其他，清空之前的自定义值
                      if (value === "其他") {
                        setCustomSampler("");
                      }
                    }}
                  >
                    <SelectTrigger id="sampler">
                      <SelectValue placeholder="选择采样器" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DPM++ 2M Karras">DPM++ 2M Karras</SelectItem>
                      <SelectItem value="DPM++ 2S a Karras">DPM++ 2S a Karras</SelectItem>
                      <SelectItem value="DPM++ SDE Karras">DPM++ SDE Karras</SelectItem>
                      <SelectItem value="DPM++ 2M">DPM++ 2M</SelectItem>
                      <SelectItem value="DPM++ 2S a">DPM++ 2S a</SelectItem>
                      <SelectItem value="DPM++ SDE">DPM++ SDE</SelectItem>
                      <SelectItem value="Euler a">Euler a</SelectItem>
                      <SelectItem value="Euler">Euler</SelectItem>
                      <SelectItem value="LMS">LMS</SelectItem>
                      <SelectItem value="Heun">Heun</SelectItem>
                      <SelectItem value="DPM2">DPM2</SelectItem>
                      <SelectItem value="DPM2 a">DPM2 a</SelectItem>
                      <SelectItem value="DPM fast">DPM fast</SelectItem>
                      <SelectItem value="DPM adaptive">DPM adaptive</SelectItem>
                      <SelectItem value="LMS Karras">LMS Karras</SelectItem>
                      <SelectItem value="DPM2 Karras">DPM2 Karras</SelectItem>
                      <SelectItem value="DPM2 a Karras">DPM2 a Karras</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* 当选择"其他"时显示自定义输入框 */}
                  {selectedSampler === "其他" && (
                    <div className="mt-2">
                      <Input
                        type="text"
                        placeholder="输入自定义采样器"
                        value={customSampler}
                        onChange={(e) => setCustomSampler(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">宽度</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    defaultValue={1024}
                    min={64}
                    max={2048}
                    step={64}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">高度</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    defaultValue={1024}
                    min={64}
                    max={2048}
                    step={64}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>LoRA模型</Label>
                <div className="mt-2 space-y-2">
                  {loras.map((lora, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="flex-1">{lora.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {lora.weight}%
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLora(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="LoRA名称"
                      value={currentLora.name}
                      onChange={(e) =>
                        setCurrentLora({ ...currentLora, name: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="权重"
                      min={0}
                      max={100}
                      value={currentLora.weight}
                      onChange={(e) =>
                        setCurrentLora({
                          ...currentLora,
                          weight: parseInt(e.target.value),
                        })
                      }
                      className="w-24"
                    />
                    <Button type="button" onClick={addLora}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? "上传中..." : "上传图片"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
