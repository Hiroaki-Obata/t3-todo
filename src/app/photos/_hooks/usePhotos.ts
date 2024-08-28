import { useState } from 'react';

import { api } from '@/trpc/react';

export function usePhotos() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { data: photos, isLoading } = api.photos.getAll.useQuery();
  const utils = api.useUtils();

  const uploadMutation = api.photos.uploadFromClient.useMutation();
  const deleteMutation = api.photos.delete.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // 画像アップロード処理 (クライアント用)
  const handleUpload = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1];
      await uploadMutation.mutateAsync({
        path: file.name,
        file: base64Data ?? '',
      });
      await utils.photos.getAll.invalidate();
      setFile(null);
      setPreview(null);
    };
    reader.readAsDataURL(file);
  };

  // 画像削除処理
  const handleDelete = async (path: string) => {
    await deleteMutation.mutateAsync({ path });
    await utils.photos.getAll.invalidate();
  };

  return {
    file,
    setFile,
    preview,
    setPreview,
    photos,
    isLoading,
    handleFileChange,
    handleUpload,
    handleDelete,
    uploadMutation,
  };
}
