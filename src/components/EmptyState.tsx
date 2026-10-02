"use client";

import { useStore } from "@/lib/store";
import { BookDashed, UploadCloud } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  const { enableDemoMode } = useStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 border border-stone-200">
        <BookDashed className="w-8 h-8 text-ink/40" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-serif text-ink mb-3">{title}</h2>
      <p className="text-ink/60 mb-8 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/upload"
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-ink text-white rounded-xl hover:bg-ink/90 transition-colors font-medium text-sm"
        >
          <UploadCloud className="w-4 h-4" /> Upload PDF
        </Link>
        <button 
          onClick={enableDemoMode}
          className="flex-1 sm:flex-none px-6 py-3 bg-white border border-stone-200 text-ink rounded-xl hover:bg-stone-50 transition-colors font-medium text-sm"
        >
          Load demo data
        </button>
      </div>
    </div>
  );
}
