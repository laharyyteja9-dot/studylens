"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, X, FileText, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const pages = [
    { name: 'Dashboard', path: '/' },
    { name: 'Knowledge Mirror', path: '/knowledge' },
    { name: 'Study Plan', path: '/plan' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Teach Back', path: '/teach' },
    { name: 'Review Radar', path: '/review' },
    { name: 'Exam Traps', path: '/traps' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Export Progress', path: '/export' },
    { name: 'Settings', path: '/settings' },
  ];

  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredConcepts = state.concepts.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.topic.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-stone-200 animate-in slide-in-from-top-10 fade-in duration-300">
        <div className="flex items-center px-4 py-3 border-b border-stone-100">
          <SearchIcon className="w-5 h-5 text-ink/40 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search concepts or pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ink text-lg placeholder:text-ink/30"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded text-[10px] font-medium text-ink/40 uppercase tracking-widest border border-stone-200 shadow-sm">Esc</kbd>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-stone-100 rounded-md sm:hidden">
              <X className="w-5 h-5 text-ink/40" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' && (
            <div className="p-8 text-center text-ink/40 text-sm">
              Type to search your knowledge map or jump to a page.
            </div>
          )}
          
          {query.trim() !== '' && (
            <>
              {filteredConcepts.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-medium uppercase tracking-widest text-ink/40">Concepts</div>
                  {filteredConcepts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/knowledge?concept=${c.id}`)}
                      className="w-full text-left px-3 py-3 hover:bg-stone-50 rounded-xl flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-accent" />
                        <div>
                          <div className="font-medium text-ink">{c.name}</div>
                          <div className="text-xs text-ink/60">{c.topic}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-ink/40 transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {filteredPages.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium uppercase tracking-widest text-ink/40">Pages</div>
                  {filteredPages.map(p => (
                    <button
                      key={p.path}
                      onClick={() => navigate(p.path)}
                      className="w-full text-left px-3 py-3 hover:bg-stone-50 rounded-xl flex items-center justify-between group transition-colors"
                    >
                      <div className="font-medium text-ink">{p.name}</div>
                      <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-ink/40 transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {filteredConcepts.length === 0 && filteredPages.length === 0 && (
                <div className="p-8 text-center text-ink/40 text-sm">
                  No results found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
