import { type inferRouterOutputs } from '@trpc/server';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { type AppRouter } from '@/server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;
type PhotosOutput = RouterOutput['photos']['getAll'];

export function PhotoGrid({
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
          <div className="relative w-[300px] h-[300px]">
            <Image
              src={photo.url}
              alt={photo.name}
              fill
              sizes="300px"
              priority
              className="object-cover"
            />
          </div>
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
