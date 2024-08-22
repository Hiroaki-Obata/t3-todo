import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

const mockNavItems = [
  { href: '/', label: 'ホーム' },
  { href: '/posts', label: '投稿一覧' },
  { href: '/profile', label: 'プロフィール' },
  { href: '/settings', label: '設定' },
];

export function Sidebar() {
  return (
    <>
      {/* デスクトップのみ表示 */}
      <div className="hidden md:flex">
        <div className="pb-12 w-64">
          <ScrollArea className="h-full py-6 pl-8 pr-6">
            <nav className="flex flex-col space-y-2">
              {mockNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
