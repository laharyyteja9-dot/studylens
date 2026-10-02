"use client";

import { useStore } from "@/lib/store";
import { X } from "lucide-react";
import Link from "next/link";

export default function DemoBanner() {
  const { state, dismissDemoBanner } = useStore();

  if (!state.isDemoMode || state.hasVisitedBefore) return null;

  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-3 flex items-center justify-between animate-in slide-in-from-top fade-in duration-500 z-40 sticky top-0 backdrop-blur-sm">
      <div className="text-sm font-medium text-ink">
        You're viewing demo data. <Link href="/upload" className="text-accent hover:underline ml-1">Upload your own PDF anytime.</Link>
      </div>
      <button 
        onClick={dismissDemoBanner}
        className="p-1 hover:bg-black/5 rounded-md transition-colors"
      >
        <X className="w-4 h-4 text-ink/60" />
      </button>
    </div>
  );
}
