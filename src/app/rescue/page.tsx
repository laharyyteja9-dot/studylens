"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Play, Pause, SkipForward, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';

interface SessionItem {
  type: 'review' | 'quiz';
  conceptId: string;
  durationMinutes: number;
}

export default function RescuePage() {
  const { state, updateMastery } = useStore();
  const [plan, setPlan] = useState<SessionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Track masteries before starting
  const [initialMasteries, setInitialMasteries] = useState<Record<string, number>>({});

  useEffect(() => {
    if (state.concepts.length === 0) return;
    
    // Sort by mastery (lowest first) and days since last tested (highest first)
    const sorted = [...state.concepts].sort((a, b) => {
      const daysA = a.lastTested ? (Date.now() - new Date(a.lastTested).getTime()) / 86400000 : 999;
      const daysB = b.lastTested ? (Date.now() - new Date(b.lastTested).getTime()) / 86400000 : 999;
      
      const scoreA = (a.mastery * 0.4) - (daysA * 2);
      const scoreB = (b.mastery * 0.4) - (daysB * 2);
      return scoreA - scoreB;
    });

    const topConcepts = sorted.slice(0, 4);
    
    const newPlan: SessionItem[] = topConcepts.map(c => ({
      type: 'review',
      conceptId: c.id,
      durationMinutes: 3
    }));
    
    newPlan.push({
      type: 'quiz',
      conceptId: topConcepts[0]?.id || '', // placeholder for overall rapid quiz
      durationMinutes: 3
    });

    const initial: Record<string, number> = {};
    topConcepts.forEach(c => initial[c.id] = c.mastery);
    setInitialMasteries(initial);

    setPlan(newPlan);
    setTimeLeft(newPlan[0].durationMinutes * 60);
  }, [state.concepts.length]); // Only run on mount or when concepts change fundamentally

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleNext = () => {
    if (currentIndex < plan.length - 1) {
      setCurrentIndex(i => i + 1);
      setTimeLeft(plan[currentIndex + 1].durationMinutes * 60);
    } else {
      setIsActive(false);
      setIsFinished(true);
      // Give a slight bump to mastery for completing the rescue session
      plan.filter(p => p.type === 'review').forEach(p => {
        updateMastery(p.conceptId, { conceptId: p.conceptId, isCorrect: true, timestamp: new Date().toISOString() });
      });
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (state.concepts.length === 0) {
    return <EmptyState title="Nothing to rescue" description="Upload a PDF to extract concepts, and we'll build a 15-minute rescue plan for your weakest topics." />;
  }
  if (plan.length === 0) return null;

  if (isFinished) {
    const summaryItems = plan.filter(p => p.type === 'review').map(p => {
      const c = state.concepts.find(x => x.id === p.conceptId);
      return {
        concept: c,
        before: initialMasteries[p.conceptId],
        after: c?.mastery
      };
    });

    return (
      <div className="max-w-2xl mx-auto py-16 animate-in fade-in">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-mastery-strong/10 text-mastery-strong rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-serif text-ink mb-4">Rescue Complete</h2>
          <p className="text-lg text-ink/70">Great job staying focused. Here is how your mastery improved.</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6 mb-12">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-stone-100 rounded-xl bg-stone-50/50">
              <div className="font-medium text-ink">{item.concept?.name}</div>
              <div className="flex items-center gap-4 text-sm font-medium tabular-nums">
                <span className="text-ink/60">{item.before}%</span>
                <ArrowRight className="w-4 h-4 text-ink/40" />
                <span className="text-mastery-strong">{item.after}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block px-8 py-4 bg-ink text-white font-medium rounded-xl hover:bg-ink/90 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentItem = plan[currentIndex];
  const concept = state.concepts.find(c => c.id === currentItem.conceptId);
  
  const totalSeconds = currentItem.durationMinutes * 60;
  const progress = timeLeft / totalSeconds;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-in fade-in">
      <div className="p-8 flex items-center justify-between">
        <Link href="/" className="text-ink/60 hover:text-ink transition-colors font-medium">Exit Session</Link>
        <div className="flex gap-2">
          {plan.map((p, i) => (
            <div key={i} className={`w-12 h-2 rounded-full transition-colors ${i < currentIndex ? 'bg-accent' : i === currentIndex ? 'bg-accent/40' : 'bg-stone-200'}`} />
          ))}
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full">
        
        {/* Circular Timer */}
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#E5E2DC" strokeWidth="2" />
            <circle 
              cx="50" cy="50" r="48" fill="none" stroke="#2F5D50" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 48}`}
              strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress)}`}
              className="transition-all duration-1000 linear"
            />
          </svg>
          <div className="text-6xl font-serif text-ink tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="text-center space-y-4 mb-16 h-32">
          <div className="text-sm font-medium uppercase tracking-widest text-accent">
            {currentItem.type === 'review' ? 'Review Concept' : 'Rapid Quiz'}
          </div>
          <h2 className="text-3xl font-serif text-ink">{currentItem.type === 'review' ? concept?.name : 'Knowledge Check'}</h2>
          {currentItem.type === 'review' && (
            <p className="text-lg text-ink/70 leading-relaxed">{concept?.summary}</p>
          )}
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 flex items-center justify-center bg-accent text-white rounded-full hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-xl"
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="w-16 h-16 flex items-center justify-center bg-white text-ink border border-stone-200 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors shadow-sm"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
