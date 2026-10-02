"use client";

import { useState, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';

type Mode = 'Simple' | 'Exam' | 'Interview';
const modes: Mode[] = ['Simple', 'Exam', 'Interview'];

function ExplainContent() {
  const { state } = useStore();
  const searchParams = useSearchParams();
  const initialConceptId = searchParams.get('concept');
  
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConceptId || '');
  const [activeMode, setActiveMode] = useState<Mode>('Simple');
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchExplanation = async (conceptId: string, mode: Mode) => {
    const key = `${conceptId}-${mode}`;
    if (cache[key]) return;
    
    if (state.isDemoMode) {
      setIsLoading(true);
      setTimeout(() => {
        setCache(prev => ({ ...prev, [key]: `[Demo] This is a ${mode} explanation for the concept. In a real app, the LLM would generate this based on the source text.` }));
        setIsLoading(false);
      }, 800);
      return;
    }

    setIsLoading(true);
    try {
      const concept = state.concepts.find(c => c.id === conceptId);
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, mode })
      });
      const data = await res.json();
      setCache(prev => ({ ...prev, [key]: data.explanation }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConceptChange = (id: string) => {
    setSelectedConceptId(id);
    fetchExplanation(id, activeMode);
  };

  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode);
    if (selectedConceptId) {
      fetchExplanation(selectedConceptId, mode);
    }
  };

  // Fetch initial if provided
  useState(() => {
    if (initialConceptId) fetchExplanation(initialConceptId, 'Simple');
  });

  if (state.concepts.length === 0) {
    return <EmptyState title="Nothing to explain" description="Upload a PDF to extract concepts, and we'll explain them in different styles to help you learn." />;
  }

  const currentKey = `${selectedConceptId}-${activeMode}`;
  const content = cache[currentKey];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <header>
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Explain It 3 Ways</h1>
        <p className="text-lg text-ink/70">See a concept from different perspectives to deepen your understanding.</p>
      </header>

      <div className="relative">
        <select 
          value={selectedConceptId}
          onChange={(e) => handleConceptChange(e.target.value)}
          className="w-full appearance-none bg-white border border-stone-200 text-lg p-4 rounded-xl outline-none focus:border-accent cursor-pointer"
        >
          <option value="" disabled>Select a concept...</option>
          {state.concepts.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40 pointer-events-none" />
      </div>

      {selectedConceptId && (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex border-b border-stone-100 bg-stone-50/50 p-2 gap-2">
            {modes.map(mode => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={cn(
                  "flex-1 py-3 text-center font-medium transition-all rounded-lg text-sm",
                  activeMode === mode ? "bg-white text-ink shadow-sm ring-1 ring-stone-200" : "text-ink/60 hover:text-ink hover:bg-stone-100/50"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <div className="p-8 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-ink/40 space-y-4 pt-12">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Generating {activeMode.toLowerCase()} explanation...</p>
              </div>
            ) : content ? (
              <div className="prose prose-stone max-w-none prose-headings:font-serif prose-p:leading-relaxed text-ink/80 text-lg">
                {content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="text-center text-ink/40 pt-12">Select a concept to begin.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplainContent />
    </Suspense>
  );
}
