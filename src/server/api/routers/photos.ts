import { z } from 'zod';

import { supabase } from '@/lib/supabase';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const photosRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const { data, error } = await supabase.storage.from('photos').list();

    if (error) throw new Error(error.message);

    const images = data.map((file) => ({
      name: file.name,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${file.name}`,
    }));

    return images;
  }),

  uploadFromClient: protectedProcedure
    .input(
      z.object({
        path: z.string(),
        file: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const file = Buffer.from(input.file, 'base64');

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(input.path, file);

      if (error) throw new Error(error.message);
      return data;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        path: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase.storage
        .from('photos')
        .remove([input.path]);

      if (error) throw new Error(error.message);
      return data;
    }),
});
