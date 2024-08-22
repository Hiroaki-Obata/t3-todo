'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function LatestPost() {
  // 最新の投稿を取得
  // データ取得中はローディング状態を表示
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const [posts] = api.post.getAll.useSuspenseQuery();

  // tRPCのユーティリティ関数を取得
  const utils = api.useUtils();

  const [name, setName] = useState('');

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName('');
    },
  });

  return (
    <div className="w-full">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? 'Submitting...' : 'Submit'}
        </button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>内容</TableHead>
              <TableHead>作成者</TableHead>
              <TableHead>作成日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.name}</TableCell>
                <TableCell>{post.createdById.name}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleString('ja-JP')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
}
