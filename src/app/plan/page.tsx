"use client";

import { useStore } from "@/lib/store";
import { Calendar, CheckCircle2, Circle, Sparkles } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";

export default function StudyPlanPage() {
  const { state, togglePlanItem, generatePlan } = useStore();

  if (state.concepts.length === 0) {
    return <EmptyState title="No study plan" description="Upload a PDF to extract concepts, and we'll build a day-by-day study plan." />;
  }

  const groupedPlan = state.studyPlan.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof state.studyPlan>);

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500 delay-50 py-8">
      <header className="flex justify-between items-end mb-8 border-b border-stone-200 pb-8">
        <div>
          <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Study Plan</h1>
          <p className="text-lg text-ink/70">A day-by-day guide to closing your knowledge gaps.</p>
        </div>
        <button 
          onClick={generatePlan}
          className="px-4 py-2 bg-white border border-stone-200 text-ink rounded-lg hover:bg-stone-50 transition-colors font-medium text-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-accent" /> Regenerate Plan
        </button>
      </header>

      {state.studyPlan.length === 0 ? (
        <div className="text-center py-24 text-ink/60">
          Click "Regenerate Plan" to build your day-by-day schedule.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPlan).map(([date, items]) => (
            <div key={date} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-medium uppercase tracking-widest text-ink/60 flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4" /> {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </h2>
              <div className="space-y-3">
                {items.map(item => {
                  const concept = state.concepts.find(c => c.id === item.conceptId);
                  if (!concept) return null;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => togglePlanItem(item.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors",
                        item.completed 
                          ? "bg-stone-50 border-stone-100 opacity-60" 
                          : "bg-white border-stone-200 hover:border-stone-300"
                      )}
                    >
                      <div className={cn("transition-colors", item.completed ? "text-mastery-strong" : "text-stone-300")}>
                        {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className={cn("font-medium", item.completed ? "text-ink/60 line-through" : "text-ink")}>{concept.name}</div>
                        <div className="text-sm text-ink/60">{concept.topic}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
