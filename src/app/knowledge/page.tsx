"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, BrainCircuit, Mic, BookOpen } from "lucide-react";
import Link from "next/link";
import { Concept } from "@/lib/types";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import EmptyState from "@/components/EmptyState";

export default function KnowledgePage() {
  const { state } = useStore();
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const topics = Array.from(new Set(state.concepts.map(c => c.topic)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-mastery-strong';
      case 'fair': return 'bg-mastery-fair';
      case 'weak': return 'bg-mastery-weak';
      case 'critical': return 'bg-mastery-critical';
      default: return 'bg-stone-300';
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-mastery-strong/10 text-mastery-strong border-mastery-strong/20';
      case 'fair': return 'bg-mastery-fair/10 text-mastery-fair border-mastery-fair/20';
      case 'weak': return 'bg-mastery-weak/10 text-mastery-weak border-mastery-weak/20';
      case 'critical': return 'bg-mastery-critical/10 text-mastery-critical border-mastery-critical/20';
      default: return 'bg-stone-100 text-stone-500 border-stone-200';
    }
  };

  return (
    <div className="flex h-full animate-in fade-in duration-500 relative">
      <div className={cn("flex-1 transition-all duration-500", selectedConcept ? 'md:pr-[400px]' : '')}>
        <header className="mb-12">
          <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Knowledge Mirror</h1>
          <p className="text-lg text-ink/70">A complete map of your understanding.</p>
        </header>

        {topics.length === 0 ? (
          <EmptyState 
            title="Your Knowledge Mirror is blank"
            description="Upload your study materials to instantly generate a map of what you need to learn."
          />
        ) : (
          <div className="space-y-12 pb-24">
            {topics.map(topic => (
              <div key={topic} className="space-y-6">
                <h2 className="text-2xl font-serif text-ink">{topic}</h2>
                <div className="grid gap-3">
                  {state.concepts
                    .filter(c => c.topic === topic)
                    .sort((a, b) => a.mastery - b.mastery) // Weakest first
                    .map(concept => (
                    <button
                      key={concept.id}
                      onClick={() => setSelectedConcept(concept)}
                      className={cn(
                        "w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-xl transition-all text-left gap-4",
                        selectedConcept?.id === concept.id ? "border-accent ring-1 ring-accent shadow-sm" : "border-stone-200 hover:border-stone-300 shadow-sm"
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-ink mb-1">{concept.name}</div>
                        <div className="text-sm text-ink/60 line-clamp-1">{concept.summary}</div>
                      </div>
                      
                      <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className={cn("px-3 py-1 rounded-full text-xs font-medium border capitalize", getStatusChip(concept.status))}>
                          {concept.status}
                        </div>
                        <div className="flex items-center gap-4 w-48">
                          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-1000", getStatusColor(concept.status))}
                              style={{ width: `${concept.mastery}%` }}
                            />
                          </div>
                          <div className="text-sm font-medium w-8 text-right tabular-nums text-ink">{concept.mastery}%</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selectedConcept && (
        <>
          <div 
            className="fixed inset-0 bg-ink/5 md:hidden z-10 animate-in fade-in" 
            onClick={() => setSelectedConcept(null)} 
          />
          <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white border-l border-stone-200 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300 z-20 flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div>
                <div className="text-sm text-ink/60 mb-1">{selectedConcept.topic}</div>
                <h3 className="text-2xl font-serif leading-tight text-ink">{selectedConcept.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedConcept(null)}
                className="p-2 -mr-2 rounded-full hover:bg-stone-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-ink/60" />
              </button>
            </div>
            
            <div className="p-6 space-y-8 flex-1">
              <p className="text-ink/80 leading-relaxed">{selectedConcept.summary}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="text-sm text-ink/60 mb-2">Mastery</div>
                  <div className="text-2xl font-serif text-ink flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getStatusColor(selectedConcept.status))} />
                    {selectedConcept.mastery}%
                  </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="text-sm text-ink/60 mb-2">Confidence</div>
                  <div className="text-2xl font-serif text-ink capitalize">{selectedConcept.confidence}</div>
                </div>
              </div>

              {/* Sparkline for attempts */}
              {selectedConcept.masteryHistory.length > 0 && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="text-sm text-ink/60 mb-2">Mastery History</div>
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedConcept.masteryHistory.map((s, i) => ({ val: s, i }))}>
                        <YAxis domain={[0, 100]} hide />
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke={selectedConcept.status === 'strong' ? '#889D89' : selectedConcept.status === 'fair' ? '#C39953' : selectedConcept.status === 'weak' ? '#C47B62' : '#A95C4A'} 
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium mb-3 text-ink">Next Action</div>
                <div className="space-y-2 flex flex-col">
                  <Link href={`/quiz?concept=${selectedConcept.id}`} className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:border-accent hover:text-accent transition-colors shadow-sm text-sm font-medium">
                    <BrainCircuit className="w-4 h-4" /> Quick quiz
                  </Link>
                  <Link href={`/teach?concept=${selectedConcept.id}`} className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:border-accent hover:text-accent transition-colors shadow-sm text-sm font-medium">
                    <Mic className="w-4 h-4" /> Teach it back
                  </Link>
                  <Link href={`/explain?concept=${selectedConcept.id}`} className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:border-accent hover:text-accent transition-colors shadow-sm text-sm font-medium">
                    <BookOpen className="w-4 h-4" /> Explain 3 ways
                  </Link>
                </div>
              </div>

              {selectedConcept.pastMistakes.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-3 text-ink">Recent Mistakes</div>
                  <ul className="space-y-2 text-sm text-ink/70">
                    {selectedConcept.pastMistakes.map((m, i) => (
                      <li key={i} className="flex gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                        <span className="text-mastery-critical mt-0.5">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium mb-2 text-ink">Source Excerpt</div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-sm text-ink/70 italic leading-relaxed">
                  &quot;{selectedConcept.sourceExcerpt}&quot;
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
