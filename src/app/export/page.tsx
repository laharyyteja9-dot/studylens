"use client";

import { useStore } from "@/lib/store";
import { FileDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Concept } from "@/lib/types";

export default function ExportPage() {
  const { state } = useStore();

  const handlePrint = () => {
    window.print();
  };

  const weakConcepts = [...state.concepts]
    .filter(c => c.status === 'critical' || c.status === 'weak')
    .sort((a, b) => a.mastery - b.mastery);

  const readinessScore = state.concepts.length > 0 
    ? Math.round(state.concepts.reduce((acc, c) => acc + c.mastery, 0) / state.concepts.length) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in duration-500 delay-50">
      <div className="print:hidden flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-200 mb-8">
        <Link href="/" className="flex items-center gap-2 text-ink/60 hover:text-ink font-medium text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium text-sm shadow-sm"
        >
          <FileDown className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-stone-200 shadow-sm print:shadow-none print:border-none print:p-0 space-y-12">
        <header className="text-center border-b border-stone-200 pb-12">
          <div className="w-12 h-12 bg-ink text-white rounded-xl flex items-center justify-center font-serif text-2xl mx-auto mb-6">S</div>
          <h1 className="text-5xl font-serif text-ink tracking-tight mb-4">StudyLens Progress Report</h1>
          <p className="text-xl text-ink/60">{state.name} • {state.examName} • {new Date(state.examDate).toLocaleDateString()}</p>
        </header>

        <section className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-4">Overall Readiness</h2>
            <div className="text-6xl font-serif text-ink tabular-nums">{readinessScore}%</div>
          </div>
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-4">Study Streak</h2>
            <div className="text-6xl font-serif text-ink tabular-nums">{state.streak} <span className="text-3xl text-ink/40 font-sans tracking-normal lowercase">days</span></div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-ink mb-6 border-b border-stone-200 pb-2">Priority Focus Areas</h2>
          {weakConcepts.length === 0 ? (
            <p className="text-ink/60">No critical or weak areas detected. Great job!</p>
          ) : (
            <div className="space-y-4">
              {weakConcepts.map(c => (
                <div key={c.id} className="flex justify-between items-start border-b border-stone-100 pb-4">
                  <div>
                    <div className="font-medium text-ink text-lg">{c.name}</div>
                    <div className="text-ink/60">{c.topic}</div>
                  </div>
                  <div className="text-xl font-serif text-mastery-critical">{c.mastery}%</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-serif text-ink mb-6 border-b border-stone-200 pb-2">Next 3 Days Schedule</h2>
          <div className="grid grid-cols-3 gap-6">
            {['Today', 'Tomorrow', 'In 3 Days'].map((day, idx) => {
              const maxDays = idx === 0 ? 1 : idx === 1 ? 2 : 4;
              const scheduled = state.concepts.filter(c => {
                const daysSince = c.lastTested ? (Date.now() - new Date(c.lastTested).getTime()) / 86400000 : 999;
                let nextReviewDays = c.status === 'critical' ? 1 : c.status === 'weak' ? 3 : c.status === 'fair' ? 7 : 14;
                if (c.pastMistakes.length > 2) nextReviewDays = Math.max(1, nextReviewDays - 2);
                const daysUntilNext = Math.max(0, nextReviewDays - daysSince);
                return idx === 0 ? daysUntilNext <= 1 : idx === 1 ? daysUntilNext === 2 : (daysUntilNext > 2 && daysUntilNext <= 4);
              });

              return (
                <div key={day} className="bg-stone-50 p-6 rounded-xl">
                  <h3 className="font-medium text-ink mb-4">{day}</h3>
                  <ul className="space-y-2 text-sm text-ink/80">
                    {scheduled.slice(0, 5).map(c => <li key={c.id}>• {c.name}</li>)}
                    {scheduled.length > 5 && <li className="text-ink/40 italic">+{scheduled.length - 5} more</li>}
                    {scheduled.length === 0 && <li className="text-ink/40 italic">Clear</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
        
        <footer className="text-center text-ink/40 text-sm pt-12 border-t border-stone-100 print:block">
          Generated by StudyLens • {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
}
