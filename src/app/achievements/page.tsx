"use client";

import { useStore } from "@/lib/store";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const { state } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 delay-50 py-8">
      <header className="border-b border-stone-200 pb-8">
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Achievements</h1>
        <p className="text-lg text-ink/70">Quiet milestones on your learning journey.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {state.achievements.map((badge, i) => {
          const isUnlocked = !!badge.unlockedAt;
          
          return (
            <div 
              key={badge.id} 
              className={cn(
                "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden animate-in zoom-in-95 fade-in",
                isUnlocked 
                  ? "bg-white border-accent shadow-sm" 
                  : "bg-stone-50 border-stone-200 opacity-60 grayscale"
              )}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              {isUnlocked && (
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isUnlocked ? "bg-accent/10 text-accent" : "bg-stone-200 text-stone-400"
                )}>
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                {isUnlocked && (
                  <div className="text-[10px] font-medium uppercase tracking-widest text-accent/60 bg-accent/5 px-2 py-1 rounded-md">
                    Unlocked
                  </div>
                )}
              </div>
              
              <h3 className={cn("text-lg font-serif mb-2", isUnlocked ? "text-ink" : "text-stone-500")}>
                {badge.name}
              </h3>
              <p className={cn("text-sm leading-relaxed", isUnlocked ? "text-ink/70" : "text-stone-400")}>
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
