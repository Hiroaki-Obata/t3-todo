'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { usePhotos } from '../_hooks/usePhotos';

export function PhotoInput() {
  const { file, preview, handleFileChange, handleUpload, uploadMutation } =
    usePhotos();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        className="relative w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {preview ? (
          <div className="absolute inset-0">
            <Image
              src={preview}
              alt="プレビュー"
              layout="fill"
              objectFit="cover"
              className="opacity-50"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            クリックして画像を選択
          </div>
        )}
      </div>
      <Button
        onClick={() => handleUpload(file)}
        disabled={!file || uploadMutation.isPending}
        className="w-full cursor-pointer mt-2"
      >
        {uploadMutation.isPending ? 'アップロード中...' : 'アップロード'}
      </Button>
    </div>
  );
}
