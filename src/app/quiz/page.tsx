"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { QuizQuestion } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function QuizPage() {
  const { state, updateMastery } = useStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [confusionResult, setConfusionResult] = useState<any>(null);
  const [isDetectingConfusion, setIsDetectingConfusion] = useState(false);

  useEffect(() => {
    if (state.concepts.length === 0) return;
    loadQuestions();
  }, [state.concepts]);

  const loadQuestions = async () => {
    if (state.isDemoMode) {
      // Demo questions
      setQuestions([
        {
          id: 'q1', conceptId: 'c11', question: 'Which of the following is true about Banker\'s Algorithm?', options: ['It prevents deadlocks by denying one of the four necessary conditions.', 'It dynamically checks resource requests against maximum future needs to avoid deadlocks.', 'It is only applicable to systems with single instances of each resource type.', 'It recovers from deadlocks by preempting resources.'], correctOptionIndex: 1, explanation: 'Banker\'s Algorithm is an avoidance algorithm that requires a priori knowledge of maximum resource needs.'
        },
        {
          id: 'q2', conceptId: 'c9', question: 'In a multilevel queue scheduling algorithm, what happens to processes?', options: ['They can move dynamically between queues based on aging.', 'They are permanently assigned to one queue based on their properties.', 'They are all placed in a single ready queue and sorted by priority.', 'They share the same time quantum regardless of which queue they are in.'], correctOptionIndex: 1, explanation: 'In standard multilevel queue scheduling, processes are permanently assigned to a queue. Multilevel feedback queue allows movement.'
        },
        {
          id: 'q3', conceptId: 'c4', question: 'What is a primary difference between shared memory and message passing for IPC?', options: ['Shared memory is faster once established, while message passing is easier to implement in distributed systems.', 'Message passing requires less system calls than shared memory after initialization.', 'Shared memory cannot be used for cooperating processes.', 'Message passing is only used for threads, not processes.'], correctOptionIndex: 0, explanation: 'Shared memory avoids system calls for every exchange, making it faster. Message passing works well across networks.'
        }
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const weakest = [...state.concepts].sort((a, b) => a.mastery - b.mastery).slice(0, 5);
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts: weakest }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    const q = questions[currentIndex];
    const isCorrect = selectedOption === q.correctOptionIndex;
    
    updateMastery(q.conceptId, { conceptId: q.conceptId, isCorrect, timestamp: new Date().toISOString() });
    
    if (!isCorrect) {
      const concept = state.concepts.find(c => c.id === q.conceptId);
      setMistakes(m => [...m, {
        conceptName: concept?.name,
        question: q.question,
        selectedAnswer: q.options[selectedOption],
        correctAnswer: q.options[q.correctOptionIndex]
      }]);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else if (mistakes.length > 1 && !state.isDemoMode) {
      setIsDetectingConfusion(true);
      try {
        const res = await fetch('/api/confusion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mistakes })
        });
        const data = await res.json();
        setConfusionResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDetectingConfusion(false);
      }
    } else {
      setConfusionResult({ hasConfusion: false, message: "Great job completing the quiz!" });
    }
  };

  if (state.concepts.length === 0) {
    return <EmptyState title="No concepts to quiz" description="Upload a PDF to extract concepts and generate adaptive quizzes." />;
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-24 space-y-6">
        <div className="h-8 bg-stone-200 rounded animate-pulse w-3/4"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-stone-100 rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (confusionResult || (currentIndex >= questions.length && questions.length > 0)) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Quiz Complete</h2>
          {isDetectingConfusion ? (
            <div className="flex items-center justify-center gap-2 text-ink/60 mt-8">
              <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing your answers...
            </div>
          ) : confusionResult?.hasConfusion ? (
            <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-8 text-left mt-8">
              <div className="flex items-center gap-3 text-mastery-critical mb-4">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-serif text-2xl text-ink">Concept confusion detected</h3>
              </div>
              <p className="text-mastery-critical font-medium mb-6 text-lg">
                {confusionResult.conceptA} vs {confusionResult.conceptB}
              </p>
              <div className="text-ink/80 leading-relaxed bg-stone-50 p-6 rounded-xl border border-stone-100">
                {confusionResult.clarification}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-8 text-center mt-8">
              <p className="text-lg text-ink/80">{confusionResult?.message || "Great effort! Your mastery scores have been updated."}</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/knowledge" className="px-6 py-3 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors font-medium">
            View Knowledge Map
          </Link>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium">
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) return null;

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <div className="flex items-center gap-4 mb-12">
        <div className="text-sm font-medium w-16">Q {currentIndex + 1}/{questions.length}</div>
        <div className="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="text-2xl font-serif leading-relaxed mb-8">{q.question}</h2>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let stateClass = "border-stone-200 hover:border-accent hover:bg-accent/5";
          if (isSubmitted) {
            if (i === q.correctOptionIndex) stateClass = "border-mastery-strong bg-mastery-strong/10 text-mastery-strong";
            else if (i === selectedOption) stateClass = "border-mastery-critical bg-mastery-critical/10 text-mastery-critical animate-shake";
            else stateClass = "border-stone-200 opacity-50";
          } else if (selectedOption === i) {
            stateClass = "border-accent ring-1 ring-accent bg-accent/5";
          }

          return (
            <button
              key={i}
              onClick={() => !isSubmitted && setSelectedOption(i)}
              disabled={isSubmitted}
              className={cn("w-full text-left p-4 rounded-xl border transition-all", stateClass)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 text-ink/80 animate-in slide-in-from-bottom-2">
          <div className="font-medium text-ink mb-2">Explanation</div>
          {q.explanation}
        </div>
      )}

      <div className="flex justify-end pt-8">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            Check Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-ink text-white rounded-lg font-medium hover:bg-ink/90 transition-colors"
          >
            Next Question <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
