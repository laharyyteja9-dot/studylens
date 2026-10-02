import { Concept, ExamTrap } from './types';

export const demoConcepts: Concept[] = [
  // Processes
  { id: 'c1', topic: 'Processes', name: 'Process Control Block (PCB)', summary: 'Data structure used by the OS to store all information about a process.', sourceExcerpt: 'Each process is represented in the operating system by a process control block (PCB)—also called a task control block.', mastery: 90, masteryHistory: [40, 50, 70, 85, 90], status: 'strong', confidence: 'high', pastMistakes: [], lastTested: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'c2', topic: 'Processes', name: 'Context Switch', summary: 'Saving the state of the old process and loading the saved state for the new process.', sourceExcerpt: 'When an interrupt occurs, the system needs to save the current context of the process running on the CPU so that it can restore that context when its processing is done.', mastery: 75, masteryHistory: [30, 45, 60, 70, 75], status: 'fair', confidence: 'medium', pastMistakes: ['Confused with interrupt handling time'], lastTested: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'c3', topic: 'Processes', name: 'Process States', summary: 'The state of a process (new, ready, running, waiting, terminated).', sourceExcerpt: 'As a process executes, it changes state. The state of a process is defined in part by the current activity of that process.', mastery: 45, masteryHistory: [20, 30, 40, 45, 45], status: 'weak', confidence: 'low', pastMistakes: ['Forgot the "waiting" state transition'], lastTested: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'c4', topic: 'Processes', name: 'Interprocess Communication (IPC)', summary: 'Mechanism for processes to communicate and synchronize their actions.', sourceExcerpt: 'Processes executing concurrently in the operating system may be either independent processes or cooperating processes.', mastery: 30, masteryHistory: [10, 15, 20, 25, 30], status: 'critical', confidence: 'low', pastMistakes: ['Confused shared memory with message passing'], lastTested: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'c5', topic: 'Processes', name: 'Threads', summary: 'A basic unit of CPU utilization, comprising a thread ID, a program counter, a register set, and a stack.', sourceExcerpt: 'A thread is a basic unit of CPU utilization; it comprises a thread ID, a program counter, a register set, and a stack.', mastery: 85, masteryHistory: [40, 50, 70, 85, 90], status: 'strong', confidence: 'high', pastMistakes: [], lastTested: new Date(Date.now() - 86400000 * 1).toISOString() },
  
  // CPU Scheduling
  { id: 'c6', topic: 'CPU Scheduling', name: 'Preemptive vs Non-preemptive', summary: 'Whether a process can be interrupted while running.', sourceExcerpt: 'CPU-scheduling decisions may take place under the following four circumstances...', mastery: 65, masteryHistory: [30, 45, 60, 70, 75], status: 'fair', confidence: 'medium', pastMistakes: [], lastTested: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'c7', topic: 'CPU Scheduling', name: 'FCFS Scheduling', summary: 'First-Come, First-Served scheduling algorithm.', sourceExcerpt: 'By far the simplest CPU-scheduling algorithm is the first-come, first-served (FCFS) scheduling algorithm.', mastery: 95, masteryHistory: [40, 50, 70, 85, 90], status: 'strong', confidence: 'high', pastMistakes: [], lastTested: new Date().toISOString() },
  { id: 'c8', topic: 'CPU Scheduling', name: 'Round Robin', summary: 'Time-sharing scheduling algorithm where each process gets a small unit of CPU time.', sourceExcerpt: 'The round-robin (RR) scheduling algorithm is designed especially for time-sharing systems.', mastery: 55, masteryHistory: [20, 30, 40, 45, 45], status: 'weak', confidence: 'medium', pastMistakes: ['Forgot how time quantum affects context switch overhead'], lastTested: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'c9', topic: 'CPU Scheduling', name: 'Multilevel Queue', summary: 'Partitions the ready queue into several separate queues.', sourceExcerpt: 'A multilevel queue scheduling algorithm partitions the ready queue into several separate queues.', mastery: 35, masteryHistory: [10, 15, 20, 25, 30], status: 'critical', confidence: 'low', pastMistakes: ['Thought processes could move between queues'], lastTested: new Date(Date.now() - 86400000 * 10).toISOString() },
  
  // Deadlocks
  { id: 'c10', topic: 'Deadlocks', name: 'Necessary Conditions', summary: 'Mutual exclusion, hold and wait, no preemption, circular wait.', sourceExcerpt: 'A deadlock situation can arise if the following four conditions hold simultaneously in a system...', mastery: 80, masteryHistory: [40, 50, 70, 85, 90], status: 'strong', confidence: 'high', pastMistakes: [], lastTested: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'c11', topic: 'Deadlocks', name: 'Banker\'s Algorithm', summary: 'Deadlock avoidance algorithm that simulates resource allocation.', sourceExcerpt: 'The resource-allocation-graph algorithm is not applicable to a resource-allocation system with multiple instances of each resource type.', mastery: 25, masteryHistory: [10, 15, 20, 25, 30], status: 'critical', confidence: 'low', pastMistakes: ['Failed to calculate the Need matrix', 'Confused safe state with deadlock free'], lastTested: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'c12', topic: 'Deadlocks', name: 'Deadlock Prevention vs Avoidance', summary: 'Prevention ensures at least one necessary condition cannot hold; avoidance requires prior information about resource usage.', sourceExcerpt: 'By ensuring that at least one of these conditions cannot hold, we can prevent the occurrence of a deadlock.', mastery: 40, masteryHistory: [20, 30, 40, 45, 45], status: 'weak', confidence: 'medium', pastMistakes: ['Thought avoidance was more restrictive than prevention'], lastTested: new Date(Date.now() - 86400000 * 4).toISOString() },

  // Memory Management
  { id: 'c13', topic: 'Memory Management', name: 'Paging', summary: 'Memory management scheme that permits the physical address space of a process to be noncontiguous.', sourceExcerpt: 'Paging is a memory-management scheme that permits the physical address space of a process to be noncontiguous.', mastery: 60, masteryHistory: [30, 45, 60, 70, 75], status: 'fair', confidence: 'medium', pastMistakes: ['Confused page and frame sizes'], lastTested: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'c14', topic: 'Memory Management', name: 'Translation Look-aside Buffer (TLB)', summary: 'Hardware cache for the page table.', sourceExcerpt: 'The TLB is associative, high-speed memory.', mastery: 38, masteryHistory: [10, 15, 20, 25, 30], status: 'critical', confidence: 'low', pastMistakes: ['Did not understand TLB miss handling'], lastTested: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: 'c15', topic: 'Memory Management', name: 'Virtual Memory', summary: 'Separation of user logical memory from physical memory.', sourceExcerpt: 'Virtual memory involves the separation of logical memory as perceived by users from physical memory.', mastery: 78, masteryHistory: [30, 45, 60, 70, 75], status: 'fair', confidence: 'high', pastMistakes: [], lastTested: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'c16', topic: 'Memory Management', name: 'Page Fault', summary: 'Occurs when a program attempts to access a block of memory that is not stored in the physical memory.', sourceExcerpt: 'Access to a page marked invalid causes a page-fault trap.', mastery: 50, masteryHistory: [20, 30, 40, 45, 45], status: 'weak', confidence: 'medium', pastMistakes: ['Forgot the exact steps OS takes during page fault'], lastTested: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export const demoExamTraps: ExamTrap[] = [
  {
    id: 't1',
    conceptA: 'Deadlock Prevention',
    conceptB: 'Deadlock Avoidance',
    description: 'Prevention uses strict rules to ensure one of the 4 conditions never occurs. Avoidance dynamically checks resource requests against max future needs (like Banker\'s Algorithm).',
    questions: ['Which strategy requires a priori knowledge of maximum resource requests?', 'Which strategy restricts how a process can request resources?']
  },
  {
    id: 't2',
    conceptA: 'Paging',
    conceptB: 'Segmentation',
    description: 'Paging divides memory into fixed-size blocks (frames). Segmentation divides memory into variable-sized logical blocks based on the program structure.',
    questions: ['Which scheme suffers from external fragmentation?', 'Which scheme uses a table that contains base and limit registers?']
  },
  {
    id: 't3',
    conceptA: 'Multiprogramming',
    conceptB: 'Time-sharing (Multitasking)',
    description: 'Multiprogramming keeps CPU busy by organizing jobs so CPU always has one to execute. Time-sharing is a logical extension where CPU switches jobs so frequently that users can interact with each program while it runs.',
    questions: ['Which one relies heavily on round-robin scheduling?', 'Which one focuses primarily on maximizing CPU utilization without considering response time?']
  }
];

export const demoReadinessHistory = Array.from({ length: 14 }).map((_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
  score: 40 + Math.floor(Math.random() * 5) + i * 2, // Upward trend
}));

export const demoAchievements = [
  { id: 'first_quiz', name: 'First Steps', description: 'Complete your first quiz.' },
  { id: 'streak_3', name: 'Momentum', description: 'Maintain a 3-day study streak.', unlockedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'critical_closed', name: 'Gap Closed', description: 'Move a concept out of Critical status.', unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'streak_7', name: 'Unstoppable', description: 'Maintain a 7-day study streak.' },
  { id: 'teach_back', name: 'The Professor', description: 'Complete a Teach Back session.' },
  { id: 'all_strong', name: 'Mastery', description: 'Get all concepts to Strong status.' },
  { id: 'rescue', name: 'Rescued', description: 'Complete a 15-Minute Rescue session.' },
  { id: 'upload', name: 'Data Miner', description: 'Upload your first PDF.', unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString() }
];

export const demoStudyTime = [
  { day: 'Mon', minutes: 15 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 45 },
  { day: 'Fri', minutes: 20 },
  { day: 'Sat', minutes: 60 },
  { day: 'Sun', minutes: 0 },
];
