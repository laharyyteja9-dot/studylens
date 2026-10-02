"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserState, Concept, ExamTrap, QuizResult } from './types';
import { demoConcepts, demoExamTraps, demoReadinessHistory, demoAchievements, demoStudyTime } from './demoData';

interface StoreContextType {
  state: UserState;
  updateName: (name: string) => void;
  updateExam: (name: string, date: string) => void;
  enableDemoMode: () => void;
  resetToEmpty: () => void;
  addConcepts: (concepts: Concept[]) => void;
  addExamTraps: (traps: ExamTrap[]) => void;
  updateMastery: (conceptId: string, result: QuizResult) => void;
  setTheme: (theme: 'light' | 'warm-dark') => void;
  togglePlanItem: (id: string) => void;
  generatePlan: () => void;
  dismissDemoBanner: () => void;
  unlockAchievement: (id: string) => void;
}

const defaultState: UserState = {
  name: 'Lahari',
  examName: 'Final Exam',
  examDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
  isDemoMode: false,
  hasVisitedBefore: true, // true by default so it doesn't trigger unexpectedly if not loaded
  theme: 'light',
  streak: 0,
  studyTimeThisWeek: [],
  concepts: [],
  examTraps: [],
  readinessHistory: [],
  achievements: demoAchievements.map(a => ({ ...a, unlockedAt: undefined })),
  studyPlan: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('studylens_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...defaultState, ...parsed });
      } catch (e) {
        console.error('Failed to parse state from local storage');
      }
    } else {
      // Auto-load demo on first visit
      setState({
        ...defaultState,
        isDemoMode: true,
        hasVisitedBefore: false,
        streak: 3,
        studyTimeThisWeek: demoStudyTime,
        concepts: demoConcepts,
        examTraps: demoExamTraps,
        readinessHistory: demoReadinessHistory,
        achievements: demoAchievements
      });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('studylens_state', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateName = (name: string) => setState(s => ({ ...s, name }));
  const updateExam = (examName: string, examDate: string) => setState(s => ({ ...s, examName, examDate }));
  const setTheme = (theme: 'light' | 'warm-dark') => setState(s => ({ ...s, theme }));
  const dismissDemoBanner = () => setState(s => ({ ...s, hasVisitedBefore: true }));
  
  const enableDemoMode = () => setState(s => ({
    ...s,
    isDemoMode: true,
    streak: 3,
    studyTimeThisWeek: demoStudyTime,
    concepts: demoConcepts,
    examTraps: demoExamTraps,
    readinessHistory: demoReadinessHistory,
    achievements: demoAchievements,
  }));
  const resetToEmpty = () => setState(defaultState);
  
  const addConcepts = (newConcepts: Concept[]) => setState(s => ({
    ...s,
    concepts: [...s.concepts, ...newConcepts]
  }));
  
  const addExamTraps = (traps: ExamTrap[]) => setState(s => ({
    ...s,
    examTraps: [...s.examTraps, ...traps]
  }));

  const unlockAchievement = (id: string) => setState(s => {
    const ach = s.achievements.find(a => a.id === id);
    if (!ach || ach.unlockedAt) return s;
    return {
      ...s,
      achievements: s.achievements.map(a => a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a)
    };
  });

  const togglePlanItem = (id: string) => setState(s => ({
    ...s,
    studyPlan: s.studyPlan.map(p => p.id === id ? { ...p, completed: !p.completed } : p)
  }));

  const generatePlan = () => setState(s => {
    // Basic day-by-day plan generation
    const weak = [...s.concepts].sort((a, b) => a.mastery - b.mastery).slice(0, 5);
    const plan = weak.map((c, i) => ({
      id: crypto.randomUUID(),
      conceptId: c.id,
      date: new Date(Date.now() + 86400000 * (i + 1)).toISOString().split('T')[0],
      completed: false
    }));
    return { ...s, studyPlan: plan };
  });

  const updateMastery = (conceptId: string, result: QuizResult) => {
    setState(s => {
      const concepts = s.concepts.map(c => {
        if (c.id === conceptId) {
          // simple mastery update logic
          const impact = result.isCorrect ? 15 : -15;
          let newMastery = Math.min(100, Math.max(0, c.mastery + impact));
          
          let newStatus = c.status;
          if (newMastery >= 80) newStatus = 'strong';
          else if (newMastery >= 60) newStatus = 'fair';
          else if (newMastery >= 40) newStatus = 'weak';
          else newStatus = 'critical';

          return {
            ...c,
            mastery: newMastery,
            masteryHistory: [...c.masteryHistory, newMastery],
            status: newStatus,
            lastTested: result.timestamp,
            pastMistakes: result.isCorrect ? c.pastMistakes : [...c.pastMistakes, 'Missed in recent quiz'],
          };
        }
        return c;
      });
      return { ...s, concepts };
    });
  };

  if (!isLoaded) return null; // Or a skeleton

  return (
    <StoreContext.Provider value={{
      state, updateName, updateExam, setTheme, enableDemoMode, resetToEmpty, addConcepts, addExamTraps, updateMastery, togglePlanItem, generatePlan, dismissDemoBanner, unlockAchievement
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
