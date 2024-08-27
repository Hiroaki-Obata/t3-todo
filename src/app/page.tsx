import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">ようこそ</h1>
      <p className="text-xl mb-8">
        このアプリケーションでは、Todoリストを管理することができます。
      </p>
      <Link href="/todos" passHref>
        <Button className="text-lg">Todoリストを見る</Button>
      </Link>
    </div>
  );
}
