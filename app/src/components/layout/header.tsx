import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">フロントエンドギルド連絡確認ツール</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button asChild variant="default">
              <Link href="/notifications/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                新規連絡作成
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
