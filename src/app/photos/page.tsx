'use client';

import { Loader2 } from 'lucide-react';

import { PhotoGrid } from './_components/photoGrid';
import { PhotoInput } from './_components/photoInput';
import { usePhotos } from './_hooks/usePhotos';

export default function PhotosPage() {
  const { photos, isLoading, handleDelete } = usePhotos();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">みてや</h1>
      <div className="mb-20 space-y-4 max-w-[200px] mx-auto">
        <PhotoInput />
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
