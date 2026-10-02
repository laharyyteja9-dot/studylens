"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, BrainCircuit, Mic, Calendar, GitCompare, UploadCloud, Map, Award, Settings, Layers, Search, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Knowledge', href: '/knowledge', icon: Library },
  { name: 'Plan', href: '/plan', icon: Map },
  { name: 'Flashcards', href: '/flashcards', icon: Layers },
  { name: 'Quiz', href: '/quiz', icon: BrainCircuit },
  { name: 'Teach Back', href: '/teach', icon: Mic },
  { name: 'Review', href: '/review', icon: Calendar },
  { name: 'Exam Traps', href: '/traps', icon: GitCompare },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Export', href: '/export', icon: FileDown },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-background flex-col hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-stone-100">
          <Link href="/" className="font-serif text-2xl tracking-tight text-ink font-semibold flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="w-6 h-6 bg-accent rounded-md flex items-center justify-center text-white text-sm">S</span>
            StudyLens
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive 
                    ? 'bg-white shadow-sm border border-stone-200 text-accent' 
                    : 'text-ink/70 hover:bg-stone-200/50 hover:text-ink border border-transparent'
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-ink/50")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 text-sm font-medium text-ink/60 hover:text-ink hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Search</span>
            <kbd className="font-sans text-[10px] uppercase bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">⌘K</kbd>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex items-center justify-around px-2 py-2 pb-safe z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors',
                isActive ? 'text-accent' : 'text-ink/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
