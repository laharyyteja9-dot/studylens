"use client";

import { useStore } from '@/lib/store';
import { Concept } from '@/lib/types';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';

export default function ReviewRadarPage() {
  const { state } = useStore();

  const concepts = state.concepts;

  // Simple rule-based grouping
  const today: Concept[] = [];
  const tomorrow: Concept[] = [];
  const in3Days: Concept[] = [];
  const in7Days: Concept[] = [];

  concepts.forEach(c => {
    const daysSince = c.lastTested ? (Date.now() - new Date(c.lastTested).getTime()) / 86400000 : 999;
    
    let nextReviewDays = 0;
    if (c.status === 'critical') nextReviewDays = 1;
    else if (c.status === 'weak') nextReviewDays = 3;
    else if (c.status === 'fair') nextReviewDays = 7;
    else nextReviewDays = 14;

    // Adjust based on past mistakes
    if (c.pastMistakes.length > 2) nextReviewDays = Math.max(1, nextReviewDays - 2);
    
    const daysUntilNext = Math.max(0, nextReviewDays - daysSince);

    if (daysUntilNext <= 1) today.push(c);
    else if (daysUntilNext <= 2) tomorrow.push(c);
    else if (daysUntilNext <= 4) in3Days.push(c);
    else in7Days.push(c);
  });

  const renderGroup = (title: string, list: Concept[]) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-serif text-ink border-b border-stone-200 pb-2">{title} <span className="text-sm font-sans text-ink/40 ml-2">{list.length}</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(c => (
            <div key={c.id} className="p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 transition-colors">
              <div className="text-sm text-ink/60 mb-1">{c.topic}</div>
              <div className="font-medium mb-3">{c.name}</div>
              <div className="flex gap-2">
                <Link href={`/quiz?concept=${c.id}`} className="text-xs font-medium px-3 py-1.5 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
                  Quiz
                </Link>
                <Link href={`/teach?concept=${c.id}`} className="text-xs font-medium px-3 py-1.5 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
                  Teach
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 py-8">
      <header>
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Review Radar</h1>
        <p className="text-lg text-ink/70">Your personalized spaced-repetition schedule.</p>
      </header>

      {concepts.length === 0 ? (
        <EmptyState title="No review schedule" description="Upload a PDF to build your spaced-repetition plan." />
      ) : (
        <div className="space-y-12">
          {renderGroup("Today", today)}
          {renderGroup("Tomorrow", tomorrow)}
          {renderGroup("In 3 Days", in3Days)}
          {renderGroup("In 7+ Days", in7Days)}
        </div>
      )}
    </div>
  );
}
