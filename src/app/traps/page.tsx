"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { AlertTriangle, Loader2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function TrapsPage() {
  const { state, addExamTraps } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/traps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts: state.concepts })
      });
      const data = await res.json();
      addExamTraps(data.traps.map((t: any) => ({ ...t, id: crypto.randomUUID() })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (state.concepts.length === 0) {
    return <EmptyState title="No exam traps yet" description="Upload a PDF and we'll analyze it to find the concepts you are most likely to confuse on an exam." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 py-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Exam Trap Detector</h1>
          <p className="text-lg text-ink/70">Commonly confused concept pairs and how to tell them apart.</p>
        </div>
        {state.examTraps.length === 0 && !isGenerating && (
          <button 
            onClick={handleGenerate}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Detect Traps
          </button>
        )}
      </header>

      {isGenerating ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4 text-ink/60">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Analyzing material for common exam traps...</p>
        </div>
      ) : state.examTraps.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-stone-300 rounded-2xl bg-stone-50/50">
          <AlertTriangle className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <p className="text-ink/60">No exam traps detected yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {state.examTraps.map(trap => (
            <div key={trap.id} className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-4 text-center font-serif text-xl">
                  {trap.conceptA}
                </div>
                <div className="text-sm font-medium uppercase tracking-widest text-ink/40">VS</div>
                <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-4 text-center font-serif text-xl">
                  {trap.conceptB}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 uppercase tracking-wide text-ink/60">The Trap</h4>
                  <p className="text-ink/80 leading-relaxed bg-stone-50/50 p-4 rounded-lg border-l-2 border-accent">
                    {trap.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 uppercase tracking-wide text-ink/60">How it&apos;s tested</h4>
                  <ul className="space-y-2">
                    {trap.questions.map((q, i) => (
                      <li key={i} className="flex gap-3 text-ink/80">
                        <span className="text-accent font-medium">•</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
