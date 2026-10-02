"use client";

import { useState, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Concept } from '@/lib/types';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addConcepts } = useStore();
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file && !text) {
      setError('Please provide a file or paste some text.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (text) formData.append('text', text);

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to extract concepts');
      
      const newConcepts: Concept[] = data.concepts.map((c: any) => ({
        id: crypto.randomUUID(),
        topic: c.topic,
        name: c.name,
        summary: c.summary,
        sourceExcerpt: c.sourceExcerpt,
        mastery: 0,
        status: 'critical' as const,
        confidence: 'low' as const,
        pastMistakes: []
      }));
      
      addConcepts(newConcepts);
      router.push('/knowledge');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Upload Material</h1>
        <p className="text-lg text-ink/70">Turn your study notes, slides, or textbook chapters into a concept map.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${isDragging ? 'border-accent bg-accent/5' : 'border-stone-300 bg-white hover:border-stone-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".pdf"
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            {file ? <FileText className="w-8 h-8 text-accent" /> : <UploadCloud className="w-8 h-8 text-ink/40" />}
          </div>
          <h3 className="text-xl font-serif mb-2">{file ? file.name : "Drag & drop a PDF"}</h3>
          <p className="text-ink/60">or click to browse your files</p>
        </div>

        <div className="text-center text-ink/40 font-medium text-sm uppercase tracking-widest">or paste text</div>

        <textarea 
          className="w-full h-48 bg-white border border-stone-200 rounded-xl p-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
          placeholder="Paste your notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button 
          onClick={handleSubmit}
          disabled={isProcessing || (!file && !text.trim())}
          className="w-full py-4 bg-accent text-white rounded-xl font-medium text-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing with AI...' : 'Extract Concepts'}
        </button>
      </div>
    </div>
  );
}
