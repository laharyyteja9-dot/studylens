"use client";

import { useState, useEffect, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { Concept } from '@/lib/types';
import { Mic, Square, CheckCircle2, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';

function TeachBackContent() {
  const { state, updateMastery } = useStore();
  const searchParams = useSearchParams();
  const initialConceptId = searchParams.get('concept');
  
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConceptId || '');
  const [explanation, setExplanation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setExplanation(prev => prev + ' ' + finalTranscript);
        }
      };
      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (!explanation.trim() || !selectedConceptId) return;
    
    if (state.isDemoMode) {
      setIsEvaluating(true);
      setTimeout(() => {
        setResult({
          understanding: 85, accuracy: 90, completeness: 70,
          missing: ['Mentioning specific examples of the concept'],
          feedback: 'You clearly grasp the core idea, just add a bit more detail next time!'
        });
        updateMastery(selectedConceptId, { conceptId: selectedConceptId, isCorrect: true, timestamp: new Date().toISOString() });
        setIsEvaluating(false);
      }, 1500);
      return;
    }

    setIsEvaluating(true);
    try {
      const concept = state.concepts.find(c => c.id === selectedConceptId);
      const res = await fetch('/api/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ explanation, concept })
      });
      const data = await res.json();
      setResult(data);
      
      const overallScore = (data.understanding + data.accuracy + data.completeness) / 3;
      updateMastery(selectedConceptId, { 
        conceptId: selectedConceptId, 
        isCorrect: overallScore > 70, 
        timestamp: new Date().toISOString() 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (state.concepts.length === 0) {
    return <EmptyState title="No concepts to teach" description="Upload a PDF to extract concepts, then test your understanding by explaining them back." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <header>
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Teach Back</h1>
        <p className="text-lg text-ink/70">Explain a concept as if you were teaching it to someone else.</p>
      </header>

      <div className="relative">
        <select 
          value={selectedConceptId}
          onChange={(e) => setSelectedConceptId(e.target.value)}
          className="w-full appearance-none bg-white border border-stone-200 text-lg p-4 rounded-xl outline-none focus:border-accent cursor-pointer"
        >
          <option value="" disabled>Select a concept to teach...</option>
          {state.concepts.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40 pointer-events-none" />
      </div>

      {selectedConceptId && !result && (
        <div className="space-y-6 animate-in slide-in-from-top-4">
          <div className="relative">
            <textarea
              className="w-full h-64 bg-white border border-stone-200 rounded-2xl p-6 text-lg outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none leading-relaxed"
              placeholder="Type your explanation here, or use the microphone to speak..."
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
            />
            {recognition && (
              <button 
                onClick={toggleRecording}
                className={cn(
                  "absolute bottom-6 right-6 p-4 rounded-full transition-all shadow-sm",
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-stone-100 text-ink/60 hover:bg-stone-200"
                )}
              >
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={!explanation.trim() || isEvaluating}
              className="px-8 py-4 bg-accent text-white rounded-xl font-medium text-lg hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isEvaluating ? 'Evaluating...' : 'Get Feedback'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-8 animate-in slide-in-from-bottom-4">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-serif">Evaluation Complete</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm text-center">
              <div className="text-sm font-medium text-ink/60 uppercase tracking-widest mb-4">Understanding</div>
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#E5E2DC" strokeWidth="6" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#2F5D50" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 46}`} strokeDashoffset={`${2 * Math.PI * 46 * (1 - result.understanding / 100)}`} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl tabular-nums">{result.understanding}%</div>
              </div>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm text-center">
              <div className="text-sm font-medium text-ink/60 uppercase tracking-widest mb-4">Accuracy</div>
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#E5E2DC" strokeWidth="6" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#2F5D50" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 46}`} strokeDashoffset={`${2 * Math.PI * 46 * (1 - result.accuracy / 100)}`} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl tabular-nums">{result.accuracy}%</div>
              </div>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm text-center">
              <div className="text-sm font-medium text-ink/60 uppercase tracking-widest mb-4">Completeness</div>
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#E5E2DC" strokeWidth="6" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#2F5D50" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 46}`} strokeDashoffset={`${2 * Math.PI * 46 * (1 - result.completeness / 100)}`} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl tabular-nums">{result.completeness}%</div>
              </div>
            </div>
          </div>

          {result.missing?.length > 0 && (
            <div className="bg-mastery-critical/5 border border-mastery-critical/10 rounded-xl p-6">
              <h4 className="text-sm font-medium uppercase tracking-widest text-mastery-critical/80 mb-4">What you missed</h4>
              <ul className="space-y-3">
                {result.missing.map((m: string, i: number) => (
                  <li key={i} className="flex gap-3 text-ink/80">
                    <span className="text-mastery-critical mt-0.5">•</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-8 bg-stone-50 border border-stone-100 rounded-xl text-center">
            <p className="text-xl font-serif text-ink leading-relaxed">
              &quot;{result.feedback}&quot;
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={() => { setResult(null); setExplanation(''); }}
              className="px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors font-medium"
            >
              Try Another Concept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeachBackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeachBackContent />
    </Suspense>
  );
}
