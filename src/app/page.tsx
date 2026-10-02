"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { Play, UploadCloud, Library, BrainCircuit, Activity, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const { state, updateName, updateExam, enableDemoMode, resetToEmpty } = useStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingExam, setIsEditingExam] = useState(false);
  
  const concepts = state.concepts;
  
  // -- EMPTY STATE (LANDING) --
  if (concepts.length === 0) {
    return (
      <div className="space-y-16 animate-in fade-in duration-700 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif text-ink tracking-tight leading-tight">
            See what you actually know.
          </h1>
          <p className="text-xl text-ink/60">
            StudyLens maps your knowledge gaps and builds a targeted review plan so you never blank on an exam again.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button 
              onClick={enableDemoMode}
              className="px-8 py-4 bg-ink text-white rounded-xl hover:bg-ink/90 transition-colors font-medium text-lg"
            >
              Try the demo
            </button>
            <Link 
              href="/upload"
              className="px-8 py-4 bg-white border border-stone-300 text-ink rounded-xl hover:bg-stone-50 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <UploadCloud className="w-5 h-5" /> Upload your PDF
            </Link>
          </div>
        </div>

        {/* Static Preview of Knowledge Mirror */}
        <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl p-8 shadow-sm opacity-60 pointer-events-none select-none relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
          <div className="space-y-8">
            <div>
              <div className="h-6 w-32 bg-stone-100 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl">
                    <div className="h-4 w-48 bg-stone-100 rounded" />
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-32 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-200 w-2/3" />
                      </div>
                      <div className="h-4 w-8 bg-stone-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -- POPULATED STATE --
  const daysRemaining = Math.ceil((new Date(state.examDate).getTime() - Date.now()) / 86400000);
  
  const readinessScore = Math.round(concepts.reduce((acc, c) => acc + c.mastery, 0) / concepts.length);
  let verdict = "At risk";
  if (readinessScore >= 80) verdict = "Ready";
  else if (readinessScore >= 60) verdict = "Almost there";

  const topicRisk = concepts.reduce((acc, c) => {
    if (!acc[c.topic]) acc[c.topic] = { totalMastery: 0, count: 0 };
    acc[c.topic].totalMastery += c.mastery;
    acc[c.topic].count++;
    return acc;
  }, {} as Record<string, { totalMastery: number, count: number }>);
  
  let biggestRiskTopic = "";
  let lowestAvg = 100;
  Object.entries(topicRisk).forEach(([topic, data]) => {
    const avg = data.totalMastery / data.count;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      biggestRiskTopic = topic;
    }
  });

  const top3Focus = [...concepts]
    .sort((a, b) => {
      const scoreA = a.mastery - (a.lastTested ? (Date.now() - new Date(a.lastTested).getTime()) / 86400000 : 999);
      const scoreB = b.mastery - (b.lastTested ? (Date.now() - new Date(b.lastTested).getTime()) / 86400000 : 999);
      return scoreA - scoreB;
    })
    .slice(0, 3);

  // Review Radar numbers
  let today = 0, tomorrow = 0, in3Days = 0, in7Days = 0;
  concepts.forEach(c => {
    const daysSince = c.lastTested ? (Date.now() - new Date(c.lastTested).getTime()) / 86400000 : 999;
    let next = c.status === 'critical' ? 1 : c.status === 'weak' ? 3 : c.status === 'fair' ? 7 : 14;
    if (c.pastMistakes.length > 2) next = Math.max(1, next - 2);
    const until = Math.max(0, next - daysSince);
    
    if (until <= 1) today++;
    else if (until <= 2) tomorrow++;
    else if (until <= 4) in3Days++;
    else in7Days++;
  });

  const topicRadarData = Object.entries(topicRisk).map(([topic, data]) => ({
    topic: topic.length > 12 ? topic.substring(0, 10) + '...' : topic,
    mastery: Math.round(data.totalMastery / data.count)
  }));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 delay-50">
      <header className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-ink tracking-tight flex items-center gap-2">
            Hi, 
            {isEditingName ? (
              <input 
                autoFocus
                onBlur={() => setIsEditingName(false)}
                className="bg-transparent border-b border-stone-300 outline-none w-32"
                value={state.name}
                onChange={(e) => updateName(e.target.value)}
              />
            ) : (
              <span onClick={() => setIsEditingName(true)} className="cursor-pointer hover:text-accent transition-colors border-b border-transparent hover:border-accent">{state.name}</span>
            )}
          </h1>
          <p className="text-lg text-ink/70 flex items-center gap-2">
            Preparing for 
            {isEditingExam ? (
              <input 
                autoFocus
                onBlur={() => setIsEditingExam(false)}
                className="bg-transparent border-b border-stone-300 outline-none w-48 text-ink"
                value={state.examName}
                onChange={(e) => updateExam(e.target.value, state.examDate)}
              />
            ) : (
              <span onClick={() => setIsEditingExam(true)} className="font-medium text-ink cursor-pointer hover:text-accent transition-colors border-b border-transparent hover:border-accent">{state.examName}</span>
            )}
            · <span className="font-medium text-ink tabular-nums">{daysRemaining} days remaining</span>
          </p>
        </div>
        {state.isDemoMode && (
          <button onClick={resetToEmpty} className="text-sm px-4 py-2 border border-stone-200 rounded-lg text-ink/60 hover:text-ink hover:bg-stone-100 transition-colors">
            Exit Demo
          </button>
        )}
      </header>

      {/* TOP ROW: Readiness, Trend, Streak & Risk */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Readiness Ring */}
        <div className="md:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center gap-6 group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#E5E2DC" strokeWidth="2" />
              <circle 
                cx="50" cy="50" r="46" fill="none" stroke="#2F5D50" strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - readinessScore / 100)}`}
                className="transition-all duration-900 ease-in-out-cubic"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-serif tabular-nums text-ink">{readinessScore}<span className="text-xl text-ink/60">%</span></span>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-1">Exam Readiness</h2>
            <div className="text-2xl font-serif text-ink mb-1">{verdict}</div>
            <p className="text-sm text-ink/60 leading-relaxed">Based on your mastery across {concepts.length} concepts.</p>
          </div>
        </div>

        {/* Readiness Trend */}
        <div className="md:col-span-4 bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-1">14-Day Trend</h2>
            <div className="text-2xl font-serif text-ink">Momentum</div>
          </div>
          <div className="h-24 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={state.readinessHistory}>
                <YAxis domain={[0, 100]} hide />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2F5D50" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col gap-6">
          {/* Streak */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-1">Study Streak</h2>
              <div className="text-2xl font-serif text-ink tabular-nums">{state.streak} Days</div>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          {/* Biggest Risk */}
          <div className="bg-mastery-critical/5 p-6 rounded-xl border border-mastery-critical/20 flex flex-col justify-between group hover:-translate-y-[1px] hover:border-mastery-critical/30 transition-all duration-300 flex-1">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-mastery-critical/60 mb-1">Biggest Risk</h2>
              <div className="text-xl font-serif text-mastery-critical leading-tight">{biggestRiskTopic || 'None'}</div>
            </div>
            <div className="mt-2">
              <Link href="/knowledge" className="text-sm font-medium text-mastery-critical/80 hover:text-mastery-critical transition-colors flex items-center gap-1">
                Review topic <Play className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: Radar & Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-6">Mastery by Topic</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topicRadarData} outerRadius="70%">
                <PolarGrid stroke="#E5E2DC" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#1C1B19', fontSize: 12 }} />
                <Radar dataKey="mastery" stroke="#2F5D50" fill="#2F5D50" fillOpacity={0.2} isAnimationActive={true} animationDuration={800} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E2DC', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 mb-6">Study Time (This Week)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.studyTimeThisWeek}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#1C1B19', fontSize: 12 }} dy={10} />
                <Tooltip cursor={{ fill: '#FAF8F5' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E2DC', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="minutes" fill="#2F5D50" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Today's Focus & Review Radar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Today's Focus */}
        <div className="md:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-sm group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-ink">Today&apos;s Focus</h2>
            <Link href="/rescue" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium focus:ring-2 focus:ring-accent focus:ring-offset-2">
              <Play className="w-3 h-3 fill-current" /> Start 15-min rescue
            </Link>
          </div>
          <div className="space-y-3">
            {top3Focus.map((c, i) => (
              <div key={c.id} className="flex justify-between items-center p-4 border border-stone-100 rounded-lg hover:border-stone-200 transition-colors bg-stone-50/30 animate-in slide-in-from-bottom-2 fade-in" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                <div className="flex gap-4 items-center">
                  <div className={cn("w-1.5 h-8 rounded-full", 
                    c.status === 'strong' ? "bg-mastery-strong" : 
                    c.status === 'fair' ? "bg-mastery-fair" : 
                    c.status === 'weak' ? "bg-mastery-weak" : "bg-mastery-critical"
                  )} />
                  <div>
                    <div className="font-medium text-ink">{c.name}</div>
                    <div className="text-sm text-ink/60">{c.topic}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="text-sm text-ink/40 font-medium hidden sm:block">~3 mins</div>
                  <div className="text-sm font-medium text-ink tabular-nums w-10">{c.mastery}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Radar */}
        <div className="md:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-sm group hover:-translate-y-[1px] hover:border-stone-300 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-ink">Review Radar</h2>
            <Link href="/review" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">View schedule</Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-100">
              <span className="font-medium text-ink">Today</span>
              <span className="text-lg font-serif text-accent tabular-nums">{today}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg">
              <span className="text-ink/70">Tomorrow</span>
              <span className="text-ink/60 font-medium tabular-nums">{tomorrow}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg">
              <span className="text-ink/70">In 3 days</span>
              <span className="text-ink/60 font-medium tabular-nums">{in3Days}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg">
              <span className="text-ink/70">In 7+ days</span>
              <span className="text-ink/60 font-medium tabular-nums">{in7Days}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
