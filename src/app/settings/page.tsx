"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { RefreshCw, CheckCircle2, User, FileText, Calendar, Moon, Sun, Trash2 } from "lucide-react";
import { useToast } from "@/lib/ToastContext";

export default function SettingsPage() {
  const { state, updateName, updateExam, setTheme, resetToEmpty } = useStore();
  const { showToast } = useToast();
  
  const [name, setName] = useState(state.name);
  const [examName, setExamName] = useState(state.examName);
  const [examDate, setExamDate] = useState(state.examDate.split('T')[0]);

  const handleSaveProfile = () => {
    updateName(name);
    updateExam(examName, new Date(examDate).toISOString());
    showToast("Profile updated successfully", "success");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetToEmpty();
      showToast("All data has been reset", "success");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500 delay-50 py-8">
      <header>
        <h1 className="text-4xl font-serif text-ink tracking-tight mb-2">Settings</h1>
        <p className="text-lg text-ink/70">Manage your profile, preferences, and data.</p>
      </header>

      <section className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-xl font-serif text-ink border-b border-stone-100 pb-4">Profile & Exam</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1 flex items-center gap-2"><User className="w-4 h-4" /> Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1 flex items-center gap-2"><FileText className="w-4 h-4" /> Exam Name</label>
              <input 
                type="text" 
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Exam Date</label>
              <input 
                type="date" 
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>
          <div className="pt-2">
            <button 
              onClick={handleSaveProfile}
              className="px-6 py-3 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-xl font-serif text-ink border-b border-stone-100 pb-4">Theme</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setTheme('light'); showToast('Theme set to Light', 'success'); }}
            className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${state.theme === 'light' ? 'border-accent bg-accent/5' : 'border-stone-200 hover:border-stone-300'}`}
          >
            <div className="w-10 h-10 bg-white rounded-full border border-stone-200 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <div className="font-medium text-ink">Light Mode</div>
              <div className="text-sm text-ink/60">Warm off-white</div>
            </div>
          </button>
          <button 
            onClick={() => { setTheme('warm-dark'); showToast('Theme set to Warm Dark', 'success'); }}
            className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${state.theme === 'warm-dark' ? 'border-accent bg-accent/5' : 'border-stone-200 hover:border-stone-300'}`}
          >
            <div className="w-10 h-10 bg-[#1C1B19] rounded-full border border-stone-700 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5 text-stone-300" />
            </div>
            <div>
              <div className="font-medium text-ink">Warm Dark</div>
              <div className="text-sm text-ink/60">Softer contrast</div>
            </div>
          </button>
        </div>
      </section>

      <section className="bg-mastery-critical/5 p-6 md:p-8 rounded-xl border border-mastery-critical/20 space-y-6">
        <div>
          <h2 className="text-xl font-serif text-mastery-critical mb-2 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Danger Zone</h2>
          <p className="text-mastery-critical/80 text-sm">Resetting your data will erase all extracted concepts, mastery scores, and history.</p>
        </div>
        <button 
          onClick={handleReset}
          className="px-6 py-3 bg-white border border-mastery-critical/30 text-mastery-critical hover:bg-mastery-critical/10 rounded-lg transition-colors font-medium text-sm"
        >
          Reset All Data
        </button>
      </section>
    </div>
  );
}
