'use client';

import { type inferRouterOutputs } from '@trpc/server';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';

type RouterOutput = inferRouterOutputs<AppRouter>;
type PhotosOutput = RouterOutput['photos']['getAll'];

function PhotoGrid({
  photos,
  onDelete,
}: {
  photos: PhotosOutput;
  onDelete: (path: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.name} className="rounded-lg overflow-hidden shadow-md">
          <Image
            src={photo.url}
            alt={photo.name}
            width={300}
            height={300}
            priority
            className="w-full h-auto object-cover"
          />
          <div className="p-2 flex justify-between items-center">
            <p className="text-sm truncate">{photo.name}</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(photo.name)}
            >
              削除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PhotosPage() {
  const [file, setFile] = useState<File | null>(null);
  const { data: photos, isLoading } = api.photos.getAll.useQuery();
  const utils = api.useUtils();

  const uploadMutation = api.photos.uploadFromClient.useMutation();

  const handleUpload = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1]; // Base64データ部分のみを抽出
      await uploadMutation.mutateAsync({
        path: file.name,
        file: base64Data ?? '',
      });
      await utils.photos.getAll.invalidate();
      setFile(null);
    };
    reader.readAsDataURL(file);
  };

  const deleteMutation = api.photos.delete.useMutation();

  const handleDelete = async (path: string) => {
    await deleteMutation.mutateAsync({ path });
    await utils.photos.getAll.invalidate();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">みてや</h1>
      <div className="mb-6 flex gap-2">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          accept="image/*"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? 'アップロード中...' : 'アップロード'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : photos ? (
        <PhotoGrid photos={photos} onDelete={handleDelete} />
      ) : (
        <div>写真が見つかりません</div>
      )}
    </div>
  );
}
