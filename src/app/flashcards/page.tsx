"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { Check, X, Undo2 } from "lucide-react";

export default function FlashcardsPage() {
  const { state, updateMastery } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Weakest concepts first
  const cards = [...state.concepts].sort((a, b) => a.mastery - b.mastery);

  if (state.concepts.length === 0) {
    return <EmptyState title="No flashcards yet" description="Upload a PDF to automatically generate flashcards for every concept." />;
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="py-24 text-center animate-in fade-in">
        <h2 className="text-3xl font-serif text-ink mb-4">You're all caught up!</h2>
        <p className="text-ink/60 mb-8">You've reviewed all available flashcards.</p>
        <button 
          onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}
          className="px-6 py-3 bg-ink text-white rounded-xl font-medium flex items-center gap-2 mx-auto hover:bg-ink/90 transition-colors"
        >
          <Undo2 className="w-4 h-4" /> Start Over
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleScore = (knewIt: boolean) => {
    updateMastery(currentCard.id, {
      conceptId: currentCard.id,
      isCorrect: knewIt,
      timestamp: new Date().toISOString()
    });
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(i => i + 1), 150);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-500 delay-50">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Flashcards</h1>
        <p className="text-lg text-ink/70">Card {currentIndex + 1} of {cards.length}</p>
      </header>

      <div className="relative h-[400px] w-full perspective-[1000px] mb-8">
        <div 
          className={cn(
            "w-full h-full relative transition-all duration-400 preserve-3d cursor-pointer",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border border-stone-200 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center hover:border-accent hover:shadow-md transition-all">
            <div className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-6">{currentCard.topic}</div>
            <h2 className="text-3xl font-serif text-ink leading-tight">{currentCard.name}</h2>
            <div className="mt-8 text-sm text-ink/40 font-medium">Click to flip</div>
          </div>
          
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-stone-50 border border-stone-200 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-serif text-ink mb-6">{currentCard.name}</h2>
            <p className="text-lg text-ink/80 leading-relaxed overflow-y-auto">{currentCard.summary}</p>
          </div>
        </div>
      </div>

      <div className={cn("flex justify-center gap-4 transition-all duration-300", isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
        <button 
          onClick={() => handleScore(false)}
          className="flex-1 max-w-[200px] py-4 bg-white border border-mastery-critical/30 text-mastery-critical rounded-xl font-medium hover:bg-mastery-critical/5 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" /> Still learning
        </button>
        <button 
          onClick={() => handleScore(true)}
          className="flex-1 max-w-[200px] py-4 bg-mastery-strong text-white rounded-xl font-medium hover:bg-mastery-strong/90 transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" /> Got it
        </button>
      </div>
    </div>
  );
}
