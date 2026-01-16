import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Play, Table, Folder, ChevronRight, ChevronLeft, 
  Terminal, Search, Settings, CheckCircle2, AlertCircle, 
  FileText, Shield, BarChart2, Layout, Zap, Image as ImageIcon,
  HardDrive, Cpu, Globe, Lock, Info, Activity
} from 'lucide-react';

// --- Shared Components ---
const ImagePlaceholder = ({ label }) => (
  <div className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2 my-4">
    <ImageIcon className="w-8 h-8 opacity-20" />
    <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
  </div>
);

// --- 13 Slides Data (Extracted from NexHire-ppt.pdf) ---
const SLIDES = [
  { id: 1, title: "Title", query: "SELECT * FROM [System].[Identity];", content: (
    <div className="text-center py-10">
      <div className="inline-block p-4 bg-blue-50 rounded-full mb-6 border border-blue-100"><Database className="w-12 h-12 text-[#007ACC]" /></div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">NexHire: Intelligent Recruitment Management System</h1>
      <p className="text-slate-500 mt-6 text-sm font-serif italic max-w-lg mx-auto">"Revolutionizing talent acquisition with advanced technology and data-driven insights." </p>
    </div>
  ), notes: "Opening the NexHire enterprise presentation." },

  { id: 2, title: "Pain Points", query: "SELECT * FROM [Market].[PainPoints];", content: (
    <div className="space-y-6">
      <h2 className="text-lg font-bold uppercase text-slate-800 border-b pb-2">Hiring Pain Points</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded shadow-sm text-center">
          <div className="text-3xl font-black text-red-600">42 Days</div>
          <div className="text-[10px] uppercase font-bold text-slate-500">Avg Time-to-Hire</div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded shadow-sm text-center">
          <div className="text-3xl font-black text-slate-900">60%</div>
          <div className="text-[10px] uppercase font-bold text-slate-500">Recruiter Matching Struggle</div>
        </div>
      </div>
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-xs text-red-800 font-mono">
        <strong>GDPR RISK:</strong> €20M+ annual violation costs in the market.
      </div>
    </div>
  ), notes: "The evolving hiring landscape faces significant challenges in volume, bias, and cost." },

  { id: 3, title: "Solution Overview", query: "EXEC [sys].[sp_ShowSolution];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Introducing NexHire </h2>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 border border-slate-200 bg-white rounded flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4" /> Intelligent Matching </div>
        <div className="p-3 border border-slate-200 bg-white rounded flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4" /> Integrated Scheduling </div>
        <div className="p-3 border border-slate-200 bg-white rounded flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4" /> Automated Workflows </div>
        <div className="p-3 border border-slate-200 bg-white rounded flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4" /> Advanced Analytics </div>
      </div>
      <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/images/4HqzzSohpEDd0Ow0jyE0g.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-120 h-90 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          />
    </div>
  ), notes: "NexHire is a comprehensive system designed to optimize the hiring process ." },

  { id: 4, title: "Architecture", query: "SELECT * FROM [sys].[Architecture];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Key Architectural Decisions </h2>
      <div className="grid grid-cols-2 gap-4 text-[10px]">
        {[
          { t: "Unified User Model", d: "Single auth for Admin, Recruiter, Candidate roles." },
          { t: "Data-Driven State Machine", d: "Workflow rules stored as data, not code." },
          { t: "Skill Proficiency Matrix", d: "Granular skill assessment (1-10 scale)." },
          { t: "Audit-First Design", d: "Critical changes automatically logged." }
        ].map(item => (
          <div key={item.t} className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong className="block text-blue-600 mb-1">{item.t}</strong> {item.d}
          </div>
        ))}
      </div>
    </div>
  ), notes: "Our architecture prioritizes efficiency, compliance, and user experience." },

  { id: 5, title: "Operational Features", query: "EXEC [sys].[sp_GetFeatures];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Core Operational Features</h2>
      <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
        {["State Machine Workflow", "Concurrency-Safe Hiring", "Smart Interview Scheduling", "Trigger-Based Email", "Document Management", "Complete Audit Trail"].map(f => (
          <div key={f} className="p-2 border border-slate-200 bg-white shadow-sm rounded">{f}</div>
        ))}
      </div>
      <div className="p-4 bg-slate-900 rounded text-emerald-400 font-mono text-[9px] uppercase tracking-widest">
        SYSTEM_STATUS: Operational | CONCURRENCY: Safe
      </div>
    </div>
  ), notes: "Key operational highlights ensure data integrity and process automation." },

  { id: 6, title: "System Scope", query: "SELECT * FROM [sys].[Scope];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">System Scope: Full Hiring Lifecycle </h2>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {[
          { l: "User Management", d: "Role-based access, secure auth." },
          { l: "Candidate Processing", d: "Skill capture, status tracking." },
          { l: "Job Management", d: "Structured requirements, vacancies." },
          { l: "Interview Coordination", d: "Conflict-free scheduling." }
        ].map(item => (
          <div key={item.l} className="p-2 border border-slate-200 bg-white flex justify-between">
            <strong>{item.l}</strong> <span className="text-slate-400 italic">Ready</span>
          </div>
        ))}
      </div>
      <ImagePlaceholder label="Full_Lifecycle_Diagram " />
    </div>
  ), notes: "NexHire covers user identity, operations, workflow control, and reporting." },

  { id: 7, title: "Innovations", query: "EXEC [sys].[sp_ShowInnovations];", content: (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 italic">Key Innovations: Redefining Recruitment</h2>
      <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <Zap className="text-blue-600 w-12 h-12" />
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase text-blue-600">Intelligent Matching Engine</div>
          <p className="text-[10px] text-slate-600 font-mono leading-tight">Applied → Screening → Interview → Hired / Rejected </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500">
        <p>• Concurrency-Safe Hiring</p>
        <p>• Automated Interview Scheduling</p>
      </div>
    </div>
  ), notes: "Cutting-edge features elevate the hiring experience for everyone involved." },

  { id: 8, title: "Compliance", query: "SELECT * FROM [Compliance].[Log];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Analytics & Compliance</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-slate-200 bg-white rounded shadow-sm">
          <Shield className="text-blue-600 w-5 h-5 mb-2" />
          <div className="text-[10px] font-bold uppercase">Bias Detection</div>
          <p className="text-[9px] text-slate-500 mt-1">Actionable insights to promote diversity and inclusion.</p>
        </div>
        <div className="p-4 border border-slate-200 bg-white rounded shadow-sm">
          <Lock className="text-blue-600 w-5 h-5 mb-2" />
          <div className="text-[10px] font-bold uppercase">GDPR Compliance</div>
          <p className="text-[9px] text-slate-500 mt-1">Built-in mechanisms for data privacy and consent.</p>
        </div>
      </div>
      <div className="text-[9px] font-mono text-slate-400 italic">Audit trails for transparency and accountability.</div>
    </div>
  ), notes: "NexHire ensures fair, compliant, and ethical hiring practices." },

  { id: 9, title: "Technologies", query: "SELECT * FROM [sys].[Stack];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Core Technologies</h2>
      <div className="p-4 bg-white border border-slate-200 rounded flex gap-4">
        <Database className="text-[#007ACC] w-8 h-8" />
        <div>
          <strong className="text-sm block">Microsoft SQL Server</strong>
          <p className="text-[10px] text-slate-500 italic">High-performance database ensuring data consistency and security.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[9px] font-bold">
        <div className="p-2 border border-slate-200 rounded flex items-center gap-1"><Globe className="w-3 h-3" /> Cloud-Native</div>
        <div className="p-2 border border-slate-200 rounded flex items-center gap-1"><Activity className="w-3 h-3" /> API Integrations</div>
        <div className="p-2 border border-slate-200 rounded flex items-center gap-1"><Cpu className="w-3 h-3" /> ML Frameworks</div>
      </div>
    </div>
  ), notes: "Optimized for complex queries and reporting to support advanced analytics" },

  { id: 10, title: "Performance", query: "EXEC [sys].[sp_CheckPerformance];", content: (
    <div className="grid grid-cols-3 gap-3">
      {[
        { v: "<1s", l: "Sub-second Response" },
        { v: "99.9%", l: "Uptime Target" },
        { v: "1M+", l: "Applications Supported" }
      ].map(stat => (
        <div key={stat.l} className="p-3 bg-white border border-slate-200 rounded text-center">
          <div className="text-2xl font-black text-blue-600">{stat.v}</div>
          <div className="text-[8px] font-bold uppercase text-slate-400 mt-1">{stat.l}</div>
        </div>
      ))}
      <div className="col-span-3 p-4 bg-slate-50 border border-slate-200 text-[10px] italic text-slate-600">
        "Our indexing strategy and query optimization ensure performance at scale."
      </div>
      <ImagePlaceholder label="Performance_Metrics_Graph" />
    </div>
  ), notes: "NexHire is more than just a prototype; it is designed for large-scale operations." },

  { id: 11, title: "Impact", query: "SELECT * FROM [Analytics].[Final];", content: (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Business Outcomes</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { v: "40%", l: "Time-to-Hire Reduction" },
          { v: "60%", l: "Quality Improvement" },
          { v: "90%", l: "Compliance Violation Reduction" },
          { v: "30%", l: "Productivity Increase" }
        ].map(outcome => (
          <div key={outcome.l} className="p-4 bg-[#007ACC] text-white rounded-lg shadow-lg text-center">
            <div className="text-2xl font-black">{outcome.v}</div>
            <div className="text-[9px] uppercase font-bold opacity-80">{outcome.l}</div>
          </div>
        ))}
      </div>
    </div>
  ), notes: "Key milestones include 20 normalized tables and 16 materialized views for real-time analytics." },

  { id: 12, title: "Frontend", query: "SELECT * FROM [UI].[Config];", content: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Frontend Implementation</h2>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="p-3 bg-white border border-slate-200 rounded"><strong>React 18 + Vite:</strong> Fast UI development.</div>
        <div className="p-3 bg-white border border-slate-200 rounded"><strong>Express.js 4:</strong> REST API server.</div>
        <div className="p-3 bg-white border border-slate-200 rounded"><strong>Tailwind CSS 3:</strong> Responsive design.</div>
        <div className="p-3 bg-white border border-slate-200 rounded"><strong>Recharts:</strong> Data visualization.</div>
      </div>
      <ImagePlaceholder label="Frontend_Dashboard_View" />
    </div>
  ), notes: "A sophisticated application with three distinct role-based dashboards." },

  { id: 13, title: "Conclusion", query: "EXEC [sys].[sp_Shutdown];", content: (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
      <h2 className="font-black text-slate-800 mb-6 uppercase text-sm tracking-widest text-center">Future RoadMap</h2>
      <ul className="space-y-2 text-[11px] font-bold text-slate-600">
        <li>• Employee Management (HRMS)</li>
        <li>• ML Predictive Hiring Success</li>
        <li>• Multi-Recruiter API Gateway</li>
      </ul>
      <div className="mt-12 text-[10px] text-emerald-600 font-mono font-black tracking-[0.2em] border-t pt-4 text-center">
        NEXHIRE_ENTERPRISE_READY_V1.0
      </div>
    </div>
  ), notes: "NexHire combines robust data management with intelligent analytics and compliance." }
];

// --- Typewriter Component ---
const Typewriter = ({ text, onComplete }) => {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    setDisplay("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="font-mono text-sm leading-relaxed">
      <span className="text-blue-600 font-bold">{display.split(' ')[0]}</span>
      <span className="text-slate-800">{display.substring(display.indexOf(' '))}</span>
      <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="border-l-2 border-slate-800 ml-1" />
    </div>
  );
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState('typing'); // typing | executing | ready
  const [showNotes, setShowNotes] = useState(false);

  const handleNext = useCallback(() => {
    if (current < SLIDES.length - 1) {
      setStatus('typing');
      setCurrent(c => c + 1);
    }
  }, [current]);

  const handlePrev = useCallback(() => {
    if (current > 0) {
      setStatus('typing');
      setCurrent(c => c - 1);
    }
  }, [current]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="fixed inset-0 bg-[#F0F0F0] text-slate-900 font-sans flex flex-col overflow-hidden select-none">
      
      {/* Top Bar */}
      <div className="bg-[#E6E6E6] border-b border-slate-300 p-1 flex items-center gap-4 text-[10px] text-slate-600 px-3">
        {['File', 'Edit', 'View', 'Query', 'Project', 'Tools', 'Window', 'Help'].map(m => (
          <span key={m} className="px-2 hover:bg-white cursor-pointer rounded">{m}</span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-[#F5F5F5] border-b border-slate-300 p-2 flex items-center gap-2 shadow-sm">
        <button 
          onClick={() => { setStatus('executing'); setTimeout(() => setStatus('ready'), 800); }}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <Play className={`${status === 'executing' ? 'animate-spin' : ''} w-4 h-4 text-emerald-600 fill-emerald-600`} />
          <span className="text-[11px] font-bold">Execute</span>
        </button>
        <div className="h-6 w-px bg-slate-300 mx-2" />
        <div className="text-[10px] text-slate-500 flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
          <Database className="w-3 h-3 text-[#007ACC]" />
          <span className="font-bold">NEXHIRE_PROD_INSTANCE</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Object Explorer */}
        <div className="w-64 bg-white border-r border-slate-300 hidden md:flex flex-col text-[11px]">
          <div className="bg-[#E6E6E6] p-2 font-bold border-b border-slate-300 flex justify-between items-center">
            <span>Object Explorer</span>
            <Settings className="w-3 h-3 text-slate-400" />
          </div>
          <div className="p-3 space-y-2 overflow-y-auto">
            <div className="flex items-center gap-2 font-bold"><Database className="w-4 h-4 text-[#007ACC]" /> NexHire_DB</div>
            {['Tables', 'Views', 'Stored Procedures'].map(f => (
              <div key={f} className="flex items-center gap-2 ml-4 text-slate-600 cursor-pointer">
                <Folder className="w-4 h-4" /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-[#E6E6E6] flex border-b border-slate-300">
            <div className="bg-white px-6 py-2.5 text-[11px] border-r border-slate-300 border-t-2 border-t-[#007ACC] flex items-center gap-2 shadow-sm">
              <FileText className="w-3.5 h-3.5 text-[#007ACC]" />
              <span className="font-bold tracking-tight italic">Slide_{current + 1}.sql*</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor */}
            <div className="p-8 h-1/4 border-b border-slate-100 bg-white">
              <Typewriter 
                text={SLIDES[current].query} 
                onComplete={() => { setStatus('executing'); setTimeout(() => setStatus('ready'), 600); }} 
              />
            </div>

            {/* Results Area */}
            <div className="flex-1 bg-[#F9F9F9] relative flex flex-col">
              <div className="px-6 py-1.5 bg-[#E6E6E6] border-b border-slate-300 text-[10px] font-bold text-slate-500 uppercase flex justify-between items-center">
                <span>Results</span>
                <span className="opacity-60 flex items-center gap-1 font-mono"><Info className="w-3 h-3" /> (42ms)</span>
              </div>
              
              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {status === 'executing' ? (
                    <motion.div key="loader" className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                      <div className="w-40 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1 }} className="w-full h-full bg-[#007ACC]" />
                      </div>
                      <span className="text-[10px] font-mono animate-pulse">FETCHING PAGE_{current + 1}...</span>
                    </motion.div>
                  ) : status === 'ready' ? (
                    <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                      <div className="max-w-4xl mx-auto">
                        {SLIDES[current].content}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Footer */}
      <div className="bg-[#007ACC] text-white p-1 px-4 text-[11px] flex justify-between items-center z-50 shadow-2xl">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 font-bold"><HardDrive className="w-3.5 h-3.5" /> ONLINE</span>
          <span className="opacity-70 font-mono hidden sm:inline">NexHire_Admin (Session: 51)</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setShowNotes(!showNotes)} className="hover:bg-white/20 px-3 py-0.5 rounded border border-white/30 uppercase text-[9px] font-black tracking-widest transition-colors">Script</button>
          <div className="flex bg-black/20 rounded-md overflow-hidden border border-white/20">
            <button onClick={handlePrev} className="px-4 py-1 border-r border-white/10 hover:bg-white/10 disabled:opacity-20" disabled={current === 0}><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={handleNext} className="px-4 py-1 hover:bg-white/10 disabled:opacity-20" disabled={current === SLIDES.length - 1}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <span className="font-mono text-xs w-10 text-center">{current + 1} / {SLIDES.length}</span>
        </div>
      </div>

      {/* Narrator script */}
      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed bottom-9 left-0 w-full bg-slate-900 text-white p-8 border-t border-slate-700 z-40 shadow-2xl"
          >
            <div className="max-w-2xl mx-auto italic font-serif text-sm opacity-90">
              "{SLIDES[current].notes}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}