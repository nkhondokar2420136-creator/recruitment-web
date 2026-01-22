import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, Database, Users, ShieldCheck, 
  BarChart3, Zap, Scale, Calendar, AlertCircle, FileCode2, 
  CheckCircle2, Globe, Clock, Target, Rocket, Award, Layout, 
  PlayCircle, Layers, Fingerprint, TrendingUp, Cpu, Server, Lock,
  Sparkles, Briefcase, Search, FileText, PieChart, ArrowRight,
  Home, Maximize2, Moon, Sun, X, Bell, Settings, User, 
  Code2, Network, Cctv, LineChart, Brain, Filter,
  Shield, DatabaseZap, Binary, Workflow, Scan, Play, Pause, EyeOff, Download, CheckCircle, RefreshCw
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const ER_STAGES = [
  { 
    id: 'all', 
    label: 'Architecture Overview', 
    scale: 1.30, x: 0, y: 0, 
    desc: '20-table relational schema with strictly enforced referential integrity.',
    engineNote: 'Normalization Level: 3NF'
  },
  { 
    id: 'auth', 
    label: 'Identity & RBAC', 
    scale: 2.7, x: '-20%', y: '40%', 
    desc: 'Unified USERS table acting as a parent to specialized Candidate/Recruiter roles.',
    engineNote: 'Uses 1:1 Identity Pattern'
  },
  { 
    id: 'job', 
    label: 'The Workflow Engine', 
    scale: 2.5, x: '46%', y: '-45%', 
    desc: 'Centralized APPLICATION state machine tracking every transition in real-time.',
    engineNote: 'Supports Composite PKs'
  },
  { 
    id: 'flow', 
    label: 'Interview Scheduling Engine', 
    scale: 2.62, x: '-44%', y: '-45%', 
    desc: 'Centralized APPLICATION state machine tracking every transition in real-time.',
    engineNote: 'Atomic State Transitions'
  },
  { 
    id: 'audit', 
    label: 'Governance & Audit', 
    scale: 3.2, x: '-15%', y: '78%', 
    desc: 'Automated audit logs and archival tables ensure high-performance for active jobs.',
    engineNote: 'Trigger-based Archiving'
  }
];

const ERInteractiveTour = () => {
  const [stage, setStage] = useState(0);
  const current = ER_STAGES[stage];

  return (
    <div className="absolute inset-0 flex">
      {/* 1. The Interactive Canvas */}
      <div className="flex-1 relative overflow-hidden bg-[#0f172a]">
        <motion.div
          animate={{
            scale: current.scale,
            x: current.x,
            y: current.y,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          className="w-full h-full flex items-center justify-center p-20"
        >
          {/* PLACE YOUR EXPORTED MERMAID IMAGE HERE */}
          <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/er-diagram.svg" 
            className="max-w-none w-[1200px] shadow-2xl rounded-lg" 
            alt="ER Diagram"
          />
        </motion.div>
      </div>

      {/* 2. Side Control Panel (matches your design) */}
      <div className="w-80 bg-slate-900/80 backdrop-blur-xl border-l border-slate-800 p-8 flex flex-col gap-6 z-20">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Architecture Tour</span>
          <h3 className="text-xl font-bold text-white leading-tight">{current.label}</h3>
          <p className="text-sm text-slate-400">{current.desc}</p>
        </div>

        <div className="space-y-3 mt-4">
          {ER_STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStage(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                stage === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${stage === i ? 'bg-white' : 'bg-slate-600'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <HolographicCard className="p-4 bg-indigo-500/10 border border-indigo-500/20">
             <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <DatabaseZap size={16} />
                <span className="text-[10px] font-black uppercase">Engine Note</span>
             </div>
             <p className="text-[11px] text-slate-400 italic">
               "{stage === 2 ? "History tracking ensures GDPR deletion logs." : "Optimized for Neon Serverless."}"
             </p>
          </HolographicCard>
        </div>
      </div>
    </div>
  );
};

const ER_STAGES2 = [
  { 
    id: 'all', 
    label: 'Flow Chart Overview', 
    scale: 1.29, x: '-0.5%', y: '0%', panX: '-0.5%', panY: '0%',
    desc: 'NextHire frontend implementation flowchart with modular separation.',
  },
  { 
    id: 'auth', 
    label: 'System Authentication', 
    scale: 4, x: '104%', y: '100%', panX: '104%', panY: '80%',
    desc: 'This module covers the entry point, validation logic, and role-based redirection.',
  },
  { 
    id: 'job', 
    label: 'Admin Dashboard', 
    scale: 4.0, x: '30%', y: '106%', panX: '-1%', panY: '106%',
    desc: 'This module focuses on system-wide governance, reporting, and maintenance.',
  },
  { 
    id: 'flow', 
    label: 'Recruiter Dashboard', 
    scale: 3.4, x: '35%', y: '-0%', panX: '-81%', panY: '-3%',
    desc: 'This module details the job posting, candidate review, and the complex hiring/scheduling logic.',
  },
  { 
    id: 'audit', 
    label: 'Candidate Dashboard', 
    scale: 4.2, x: '68%', y: '-110%', panX: '-90%', panY: '-110%',
    desc: 'This module covers job browsing, application lifecycle, and profile management.',
  }
];

const STAGE_DURATIONS = {
  all: 5000,
  auth: 5000,
  job: 7000,
  flow: 14000,
  audit: 14000
};

const ERInteractiveTour2 = () => {
  const [stage, setStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const current = ER_STAGES2[stage];
  const controls = useAnimation();

  useEffect(() => {
    const runSequence = async () => {
      // PHASE 1: Smooth Spring Jump
      await controls.start({
        scale: current.scale,
        x: current.x,
        y: current.y,
        transition: { 
            type: "spring", 
            stiffness: 40, 
            damping: 15, 
            mass: 1.2 
        }
      });

      // PHASE 2: Start the infinite "Drift" loop
      controls.start({
        x: [current.x, current.panX],
        y: [current.y, current.panY],
        transition: {
          x: { duration: 12, ease: "linear", repeat: Infinity, repeatType: "reverse" },
          y: { duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }
        }
      });
    };

    runSequence();

    // AUTO-PLAY TIMER
    let timer;
    if (isAutoPlaying) {
      const duration = STAGE_DURATIONS[current.id] || 5000;
      timer = setTimeout(() => {
        setStage((prev) => (prev + 1) % ER_STAGES2.length);
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [stage, controls, current, isAutoPlaying]);

  return (
    <div className="absolute inset-0 flex bg-[#0f172a]">
      {/* 1. The Interactive Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          animate={controls}
          style={{ transformOrigin: "center center" }}
          className="w-full h-full flex items-center justify-center p-20"
        >
          <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/frontend_flowchart.svg" 
            className="max-w-none w-[1200px] shadow-2xl rounded-lg" 
            alt="Frontend Flowchart"
          />
        </motion.div>
      </div>

      {/* 2. Side Control Panel */}
      <div className="w-80 bg-slate-900/80 backdrop-blur-xl border-l border-slate-800 p-8 flex flex-col gap-6 z-20">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Logic Flow</span>
            <h3 className="text-xl font-bold text-white leading-tight">{current.label}</h3>
          </div>
          <button 
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-full bg-slate-800 text-indigo-400 hover:bg-slate-700 transition-colors"
          >
            {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">{current.desc}</p>

        <div className="space-y-3 mt-4">
          {ER_STAGES2.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setStage(i);
                setIsAutoPlaying(false); // Manual override pauses auto-play
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                stage === i 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${stage === i ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center gap-2 text-indigo-400 mb-2 relative z-10">
                <DatabaseZap size={16} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Implementation Detail</span>
              </div>
              <p className="text-[11px] text-slate-400 italic relative z-10 leading-snug">
                {stage === 1 ? "Component architecture follows the Atomic Design pattern." : 
                 stage === 4 ? "Component architecture follows the Atomic Design pattern." : 
                 "Component architecture follows the Atomic Design pattern."}
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Advanced Transition Presets ---
const slideVariants = {
  enter: (direction = 1) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
      opacity: { duration: 0.4 }
    }
  },
  exit: (direction = 1) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 15 : -15,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  })
};

const pageFlipVariants = {
  enter: (direction = 1) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.9,
    x: direction > 0 ? 100 : -100
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      rotateY: {
        type: "spring",
        stiffness: 200,
        damping: 25
      },
      duration: 0.6
    }
  },
  exit: (direction = 1) => ({
    rotateY: direction < 0 ? -90 : 90,
    opacity: 0,
    scale: 0.9,
    x: direction < 0 ? -100 : 100
  })
};

const cubeVariants = {
  enter: (direction = 1) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    scale: 1,
    transition: {
      rotateX: {
        type: "spring",
        stiffness: 250,
        damping: 30
      },
      duration: 0.7
    }
  },
  exit: (direction = 1) => ({
    rotateX: direction < 0 ? -90 : 90,
    opacity: 0,
    scale: 0.8
  })
};

const fadeZoomVariants = {
  enter: {
    opacity: 0,
    scale: 0.5,
    filter: "blur(20px)"
  },
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.5,
    filter: "blur(20px)",
    transition: {
      duration: 0.6
    }
  }
};

const slideTransitions = [
  slideVariants,
  pageFlipVariants,
  cubeVariants,
  fadeZoomVariants
];

// --- Reusable Animated Components ---
const GlowEffect = ({ children, intensity = 1 }) => (
  <motion.div
    animate={{
      boxShadow: [
        `0 0 20px rgba(79, 70, 229, ${0.2 * intensity})`,
        `0 0 40px rgba(79, 70, 229, ${0.4 * intensity})`,
        `0 0 20px rgba(79, 70, 229, ${0.2 * intensity})`
      ]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="relative"
  >
    {children}
  </motion.div>
);

const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -10, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const ScanLine = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent"
    animate={{
      y: ["0%", "100%"]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const ParticleField = ({ count = 20 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
        initial={{
          x: Math.random() * 100 + '%',
          y: Math.random() * 100 + '%',
          opacity: 0
        }}
        animate={{
          x: [null, Math.random() * 100 + '%'],
          y: [null, Math.random() * 100 + '%'],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      />
    ))}
  </div>
);

const HolographicCard = ({ children, className = "" }) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl ${className}`}
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
    {children}
  </motion.div>
);

// --- Reusable Image Placeholder with Animation ---
const ImagePlaceholder = ({ id, label, icon: Icon, height = "h-48", coords = "", animate = true }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02, rotateY: 5 }}
    className={`w-full ${height} bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-3 relative overflow-hidden group`}
  >
    {animate && <ScanLine />}
    <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase z-10">
      [Image {id}]
    </div>
    <FloatingElement delay={id * 0.2}>
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon size={40} strokeWidth={1.5} />
      </motion.div>
    </FloatingElement>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] z-10">{label}</span>
    {coords && (
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[9px] text-slate-400 font-mono z-10"
      >
        {coords}
      </motion.span>
    )}
  </motion.div>
);

// Add this component inside your slide component or as a separate component
const CardSwapper = () => {
  const [swap, setSwap] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-swap every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setSwap(prev => !prev);
    }, 15000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  const concurrencyCard = (
    <motion.div
      key="concurrency"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      whileHover={{ 
        y: -3,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsPaused(true)}
      onHoverEnd={() => setIsPaused(false)}
      className="relative group h-1/2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity" />
      
      <div className="p-5 text-white relative h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="p-1.5 bg-blue-500/20 rounded-lg"
                >
                  <Shield size={18} className="text-blue-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Concurrency Safety</h4>
              </div>
              <p className="text-slate-300 text-sm leading-tight">
                Ensuring data integrity in multi-user environments with real-time conflict resolution
              </p>
            </div>
            
            <motion.div
              className="relative mt-1"
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Cpu size={22} className="text-blue-400 relative" />
            </motion.div>
          </div>
          
          <div className="mt-auto">
            <div className="space-y-2 mb-3">
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "85%" }}
                  transition={{ delay: 0.7, duration: 1 }}
                />
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "92%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>Optimistic Locking</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>Conflict Resolution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const gdprCard = (
    <motion.div
      key="gdpr"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsPaused(true)}
      onHoverEnd={() => setIsPaused(false)}
      className="relative group h-1/2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity" />
      
      <div className="p-5 bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 rounded-2xl text-white shadow-lg h-full relative overflow-hidden">
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="p-1.5 bg-white/10 rounded-lg"
                >
                  <Lock size={18} />
                </motion.div>
                <h4 className="text-lg font-bold">GDPR-Ready</h4>
              </div>
              <p className="text-indigo-100 text-sm leading-tight">
                Built-in anonymization, data retention, and privacy by design
              </p>
            </div>
            
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Globe size={22} className="text-white/50" />
            </motion.div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              {[
                { icon: EyeOff, label: "Data Masking", color: "text-emerald-300" },
                { icon: Calendar, label: "Auto-Expiry", color: "text-amber-300" },
                { icon: Download, label: "Portability", color: "text-cyan-300" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <item.icon size={14} className={item.color} />
                  </div>
                  <span className="text-xs text-indigo-100">{item.label}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>EU Compliance</span>
              </div>
              <span className="text-indigo-400">•</span>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>Privacy Default</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {swap ? (
          <motion.div
            key="top-gdpr"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {gdprCard}
          </motion.div>
        ) : (
          <motion.div
            key="top-concurrency"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {concurrencyCard}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {swap ? (
          <motion.div
            key="bottom-concurrency"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {concurrencyCard}
          </motion.div>
        ) : (
          <motion.div
            key="bottom-gdpr"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {gdprCard}
          </motion.div>
        )}
      </AnimatePresence>
      
      
    </>
  );
};

// --- Reusable Metric Card with Advanced Animation ---
const MetricCard = ({ value, label, color = "indigo", icon: Icon, description, delay = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  
  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      delay: delay + 0.5
    });
    return controls.stop;
  }, [count, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay 
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        rotateY: 5,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-lg transition-all relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-indigo-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />
      <motion.div 
        className={`p-3 rounded-xl bg-slate-50 text-${color}-600 relative`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={24} />
      </motion.div>
      <div className="relative">
        <motion.h3 
          className={`text-2xl font-black text-${color}-600 leading-none mb-1`}
        >
          {typeof value === 'number' ? rounded : value}
        </motion.h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {description && <p className="text-[10px] text-slate-400 mt-1">{description}</p>}
      </div>
    </motion.div>
  );
};

// --- Animated Feature Card ---
const FeatureCard = ({ title, description, icon: Icon, color = "indigo", delay = 0, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateX: 90 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ 
      type: "spring",
      stiffness: 200,
      damping: 25,
      delay: delay + index * 0.1
    }}
    whileHover={{ 
      y: -8,
      rotateY: 5,
      transition: { type: "spring", stiffness: 400 }
    }}
    className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-all relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-indigo-500/10 group-hover:to-indigo-500/5 transition-all duration-500" />
    <div className="flex items-center gap-3 mb-2 relative z-10">
      <motion.div 
        className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}
        whileHover={{ scale: 1.2, rotate: 180 }}
        transition={{ duration: 0.4 }}
      >
        <Icon size={18} />
      </motion.div>
      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
    </div>
    <p className="text-xs text-slate-500 relative z-10">{description}</p>
  </motion.div>
);

// --- Data Stream Visualization ---
const DataStream = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 100 + 50}px`
        }}
        animate={{
          x: [0, 100, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      />
    ))}
  </div>
);

// --- Animated Progress Bar ---
const AnimatedProgressBar = ({ progress, color = "indigo", label, delay = 0 }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1 }}
        className="font-bold text-slate-900"
      >
        {progress}%
      </motion.span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          duration: 1.5,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full relative`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
          animate={{ x: ["0%", "100%"] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  </div>
);

// --- Circuit Background ---
const CircuitBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-10">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M0,50 L100,50 M50,0 L50,100" stroke="rgb(79, 70, 229)" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="5" fill="rgb(79, 70, 229)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  </div>
);

// --- Presentation Slides with Advanced Animations ---
const SLIDES = [
  {
    id: 1,
    title: "",
    transition: fadeZoomVariants,
    content: (
      <div className="relative h-full flex flex-col items-center justify-center text-center space-y-12 overflow-hidden">
        <CircuitBackground />
        <ParticleField count={30} />
        
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2
          }}
          className="relative"
        >
          <GlowEffect intensity={0}>
            <div className="w-40 h-40 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 rotate-3">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Sparkles size={64} />
              </motion.div>
            </div>
          </GlowEffect>
        </motion.div>
        
        <div className="space-y-6 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.5,
              type: "spring",
              stiffness: 100
            }}
          >
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter">
              <span className="relative inline-block">
                Nex
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
              <motion.span 
                className="text-indigo-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Hire
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-2xl text-indigo-600 font-bold uppercase tracking-[0.1em]"
          >
            Intelligent Recruitment Management System
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg"
          >
            Revolutionizing talent acquisition with advanced technology and data-driven insights.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex gap-6 relative z-10"
        >
          {["Enterprise Ready", "AI-Powered", "GDPR Compliant"].map((tag, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 1.4 + idx * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1,
                y: -5,
                transition: { type: "spring", stiffness: 400 }
              }}
              className={`px-8 py-4 text-sm font-black uppercase tracking-widest rounded-2xl ${
                idx === 0 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400'
              }`}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "Problem Statement: The Evolving Hiring Landscape",
    transition: cubeVariants,
    content: (
      <div className="space-y-8 relative">
        <DataStream />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 text-lg"
        >
          Modern recruitment faces significant challenges, from overwhelming applicant volumes to ensuring fair and efficient processes.
        </motion.p>
        
        <div className="grid grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FloatingElement delay={0.2}><img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/7TUU7yLatA4hACE9z-hZa.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-120 h-120 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          /></FloatingElement>
          </motion.div>
          
          <div className="space-y-6">
            <MetricCard
              value={42}
              label="Days Avg Time-to-Hire"
              color="rose"
              icon={Clock}
              description="Managing thousands of applications and rapid hiring cycles"
              delay={0.5}
            />
            
            <MetricCard
              value={60}
              label="Bias Detection Gap"
              color="amber"
              icon={Scale}
              description="Ensuring objective evaluation and mitigating unconscious bias"
              delay={0.6}
            />
            
            <MetricCard
              value={30}
              label="Candidate Drop-off Rate"
              color="cyan"
              icon={Zap}
              description="Streamlining workflows to reduce time-to-hire"
              delay={0.7}
            />
            
            <MetricCard
              value={20000000}
              label="GDPR Compliance Cost"
              color="indigo"
              icon={ShieldCheck}
              description="Navigating complex regulations and data privacy"
              delay={0.8}
            />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Solution Overview: Introducing NexHire",
    transition: pageFlipVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-black text-slate-900 mb-4">A Comprehensive, Intelligent System</h3>
              <p className="text-slate-500">
                NexHire transforms hiring with advanced technology and data-driven insights.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Intelligent Matching",
                  description: "Sophisticated algorithms for precise candidate-job fit",
                  icon: Target,
                  color: "indigo",
                  index: 0
                },
                {
                  title: "Integrated Scheduling",
                  description: "Seamless interview coordination and calendar management",
                  icon: Calendar,
                  color: "emerald",
                  index: 1
                },
                {
                  title: "Automated Workflows",
                  description: "Streamlined processes from application to offer",
                  icon: Workflow,
                  color: "amber",
                  index: 2
                },
                {
                  title: "Advanced Analytics",
                  description: "Real-time insights for bias detection and optimization",
                  icon: Brain,
                  color: "purple",
                  index: 3
                }
              ].map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  {...feature}
                  delay={0.3 + idx * 0.1}
                />
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0.8, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
            className="relative"
          >
            <FloatingElement delay={0.2}>
              <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/4HqzzSohpEDd0Ow0jyE0g.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-120 h-90 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          />
            </FloatingElement>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="p-6 bg-gradient-to-r from-indigo-50 to-white rounded-2xl border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                transition: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            >
              <DatabaseZap size={32} className="text-indigo-600" />
            </motion.div>
            <div>
              <h4 className="font-bold text-slate-900">GDPR-Ready with Full Audit Trails</h4>
              <p className="text-sm text-slate-500">Built-in compliance and transparent operations</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  },
{
    id: 4,
    title: "Key Architectural Decisions",
    transition: slideVariants,
    content: (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
          >
            NexHire's architecture prioritizes <span className="font-bold">efficiency</span>, <span className="font-bold">compliance</span>, and <span className="font-bold">user experience</span>
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-8" style={{ height: "calc(100vh - 180px)" }}>
          {/* Left Column - Architectural Decisions - Scrollable if needed */}
          <div className="space-y-6 pr-2 overflow-y-auto" style={{ maxHeight: "95%" }}>
            {[
              {
                number: "01",
                title: "Unified User Model",
                description: "Single authentication for Admin, Recruiter, Candidate roles",
                icon: Users,
                gradient: "from-blue-500 to-cyan-400",
                delay: 0.1
              },
              {
                number: "02",
                title: "Data-Driven State Machine",
                description: "Workflow rules stored as data, not hardcoded logic",
                icon: Cpu,
                gradient: "from-purple-500 to-pink-500",
                delay: 0.2
              },
              {
                number: "03",
                title: "Skill Proficiency Matrix",
                description: "Granular skill assessment (1-10 scale) for precise matching",
                icon: TrendingUp,
                gradient: "from-emerald-500 to-teal-400",
                delay: 0.3
              },
              {
                number: "04",
                title: "Audit-First Design",
                description: "Every critical change automatically logged for compliance",
                icon: FileText,
                gradient: "from-amber-500 to-orange-500",
                delay: 0.4
              }
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1 + item.delay,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ 
                  x: 5,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400 }
                }}
                className="flex gap-5 items-start p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all group relative overflow-hidden min-h-[100px]"
              >
                {/* Fixed: Darker, more visible number */}
                <motion.div 
                  className="relative z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-3xl font-black text-slate-800 p-3 rounded-xl bg-gradient-to-br from-slate-100 to-white shadow-sm relative z-10"
                    >
                      {item.number}
                    </motion.div>
                    {/* Subtle gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  </div>
                </motion.div>
                
                <div className="flex-1 relative z-10 space-y-2">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} shadow-sm`}
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <item.icon size={18} className="text-white" />
                    </motion.div>
                    <motion.h4 
                      className="text-lg font-bold text-slate-900"
                      whileHover={{ x: 2 }}
                    >
                      {item.title}
                    </motion.h4>
                  </div>
                  
                  <motion.p 
                    className="text-sm text-slate-600 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Right Column - Feature Cards with Auto-Swap */}
          <div className="space-y-6" style={{ height: "100%" }}>
            <CardSwapper />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Core Operational Features",
    transition: cubeVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: Cctv,
              title: "State Machine Workflow",
              color: "from-indigo-600 to-indigo-700",
              index: 0
            },
            {
              icon: Database,
              title: "Concurrency-Safe Hiring",
              color: "from-emerald-600 to-emerald-700",
              index: 1
            },
            {
              icon: Calendar,
              title: "Smart Interview Scheduling",
              color: "from-amber-600 to-amber-700",
              index: 2
            },
            {
              icon: Bell,
              title: "Trigger-Based Email",
              color: "from-cyan-600 to-cyan-700",
              index: 3
            },
            {
              icon: FileText,
              title: "Document Management",
              color: "from-purple-600 to-purple-700",
              index: 4
            },
            {
              icon: ShieldCheck,
              title: "Complete Audit Trail",
              color: "from-rose-600 to-rose-700",
              index: 5
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.15,
                rotateY: 180,
                transition: { 
                  rotateY: { duration: 0.6 },
                  scale: { type: "spring", stiffness: 300 }
                }
              }}
              className="text-center group relative"
            >
              <div className={`w-24 h-24 rounded-[1.5rem] bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-xl relative overflow-hidden`}>
                <div className="text-white text-2xl">
                  <feature.icon size={32} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">{feature.title}</h4>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <FloatingElement delay={0.2}>
            <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/MixCollage-16-Jan-2026-01-39-AM-3318.jpg" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-240 h-60 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          />
          </FloatingElement>
        </motion.div>
      </div>
    )
  },
  {
    id: 6,
    title: "System Scope: Full Hiring Lifecycle",
    transition: pageFlipVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "User Management",
              description: "Role-based access, secure authentication",
              color: "indigo",
              index: 0
            },
            {
              icon: Fingerprint,
              title: "Candidate Processing",
              description: "Profile creation, skill capture, document uploads",
              color: "emerald",
              index: 1
            },
            {
              icon: Briefcase,
              title: "Job Management",
              description: "Job postings, structured requirements",
              color: "amber",
              index: 2
            },
            {
              icon: Calendar,
              title: "Interview Coordination",
              description: "Conflict-free scheduling, automated notifications",
              color: "cyan",
              index: 3
            },
            {
              icon: LineChart,
              title: "Advanced Analytics",
              description: "Real-time dashboards, funnel conversion",
              color: "purple",
              index: 4
            },
            {
              icon: Lock,
              title: "Compliance",
              description: "Audit logging, data retention, anonymization",
              color: "rose",
              index: 5
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 60, opacity: 0, rotateX: 45 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 25
              }}
              whileHover={{ 
                y: -15,
                scale: 1.05,
                transition: { type: "spring", stiffness: 400 }
              }}
              className="p-6 bg-white border border-slate-100 rounded-2xl flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-indigo-500/10 group-hover:to-indigo-500/5 transition-all duration-500" />
              <motion.div 
                className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600`}
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, 360],
                  transition: { rotate: { duration: 0.6 } }
                }}
              >
                <item.icon size={24} />
              </motion.div>
              <div className="space-y-2 relative z-10">
                <h5 className="text-sm font-black uppercase text-slate-800 leading-tight">{item.title}</h5>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-gradient-to-r from-indigo-50 to-white rounded-2xl border border-indigo-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">End-to-End Coverage</h4>
              <p className="text-sm text-slate-500">Complete lifecycle management from application to onboarding</p>
            </div>
            <motion.div
              animate={{ 
                x: [0, 10, 0],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              <Workflow size={32} className="text-indigo-600" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 7,
    title: "Key Innovations: Redefining Recruitment",
    transition: {
        ...slideVariants,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    },
    content: (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.p
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-slate-600 text-lg max-w-3xl mx-auto bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
          >
            NexHire integrates cutting-edge features to elevate the hiring experience for both recruiters and candidates
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Intelligent Matching Engine */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <HolographicCard className="h-64">
                <div className="p-8 text-white relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl" />
                  
                  {/* Animated circuit pattern */}
                  <motion.div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 25% 25%, #00ffff 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, #00ffff 2px, transparent 2px)
                      `,
                      backgroundSize: '50px 50px'
                    }}
                    animate={{ 
                      backgroundPosition: ['0px 0px', '50px 50px'],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                        }}
                        className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg"
                      >
                        <Cpu size={24} />
                      </motion.div>
                      <h4 className="text-2xl font-bold">Intelligent Matching Engine</h4>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-between relative">
                      {['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'].map((stage, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0, y: 30, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          transition={{ 
                            delay: idx * 0.15,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ 
                            scale: 1.2,
                            y: -5,
                            transition: { type: "spring", stiffness: 400 }
                          }}
                          className="text-center relative"
                        >
                          {/* Connecting lines */}
                          {idx < 4 && (
                            <motion.div
                              className="absolute top-7 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50"
                              initial={{ width: 0 }}
                              animate={{ width: "32px" }}
                              transition={{ delay: idx * 0.15 + 0.5 }}
                            />
                          )}
                          
                          {/* Stage indicator */}
                          <motion.div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 relative ${
                              stage === 'Hired' ? 'bg-gradient-to-br from-emerald-500 to-green-400' :
                              stage === 'Rejected' ? 'bg-gradient-to-br from-rose-500 to-pink-400' :
                              'bg-gradient-to-br from-indigo-600 to-blue-500'
                            }`}
                            whileHover={{ 
                              rotate: 360,
                              scale: 1.1
                            }}
                            transition={{ duration: 0.6 }}
                          >
                            {/* Pulse animation */}
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-current opacity-20"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.2, 0, 0.2]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <span className="text-sm font-bold">{idx + 1}</span>
                          </motion.div>
                          
                          {/* Stage label */}
                          <motion.span 
                            className="text-sm text-slate-300 block"
                            whileHover={{ scale: 1.1 }}
                          >
                            {stage}
                          </motion.span>
                          
                          {/* Percentage indicator */}
                          <motion.div
                            className="h-1 w-full bg-slate-700 rounded-full mt-2 overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: idx * 0.15 + 0.3 }}
                          >
                            <motion.div
                              className={`h-full ${
                                stage === 'Hired' ? 'bg-emerald-500' :
                                stage === 'Rejected' ? 'bg-rose-500' :
                                'bg-cyan-500'
                              }`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${[80, 60, 40, 20, 15][idx]}%` }}
                              transition={{ delay: idx * 0.15 + 0.8, duration: 1 }}
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>

            {/* Automated Interview Scheduling */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 rounded-3xl text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
                {/* Floating calendar icons */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white/10"
                    initial={{ 
                      x: Math.random() * 300,
                      y: Math.random() * 100,
                      rotate: Math.random() * 360
                    }}
                    animate={{ 
                      y: [null, Math.random() * -50],
                      rotate: [null, Math.random() * 360]
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    <Calendar size={40} />
                  </motion.div>
                ))}
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="p-3 bg-white/10 rounded-xl"
                    >
                      <Calendar size={24} />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold">Automated Interview Scheduling</h4>
                      <p className="text-indigo-100 text-sm mt-1">Reduces administrative burden and calendar conflicts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-6">
                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={16} className="text-emerald-300" />
                        <span className="text-sm">Smart Time Slot Detection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-300" />
                        <span className="text-sm">Auto-Timezone Adjustment</span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        x: [0, 10, 0],
                        transition: { duration: 3, repeat: Infinity }
                      }}
                    >
                      <Clock size={32} className="text-cyan-300" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            

            {/* Logo/Visual Element */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring" }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 200 }
              }}
              className="flex justify-center"
            >
              <FloatingElement delay={0.2}><img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/P1CxKHbAfR_RrkArP6frv.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-120 h-110 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          /></FloatingElement>
            </motion.div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Analytics & Compliance: Data-Driven and Ethical Hiring",
    transition: fadeZoomVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0, rotateY: 45 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="p-8 bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="p-3 bg-purple-100 text-purple-600 rounded-xl"
              animate={{ 
                rotateY: [0, 360],
                transition: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
            >
              <BarChart3 size={24} />
            </motion.div>
            <h4 className="text-xl font-bold text-slate-900">Bias Detection Analytics</h4>
          </div>
          <motion.ul className="space-y-4">
            {[
              "Identifies potential biases in candidate evaluation",
              "Provides actionable insights for diversity",
              "Leverages anonymized data for ethical analysis"
            ].map((item, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <motion.div 
                  className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    transition: { duration: 2, repeat: Infinity, delay: idx * 0.3 }
                  }}
                />
                <span className="text-slate-600">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0, rotateY: -45 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
          className="p-8 bg-gradient-to-br from-cyan-50 to-white rounded-3xl border border-cyan-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="p-3 bg-cyan-100 text-cyan-600 rounded-xl"
              animate={{ 
                rotate: [0, 360],
                transition: { duration: 6, repeat: Infinity, ease: "linear" }
              }}
            >
              <Lock size={24} />
            </motion.div>
            <h4 className="text-xl font-bold text-slate-900">GDPR Compliance</h4>
          </div>
          <motion.ul className="space-y-4">
            {[
              "Built-in data privacy and consent management",
              "Adherence to global data protection regulations",
              "Complete audit trails for transparency"
            ].map((item, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <motion.div 
                  className="w-3 h-3 bg-cyan-600 rounded-full mt-2 flex-shrink-0"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    transition: { duration: 2, repeat: Infinity, delay: idx * 0.3 + 0.2 }
                  }}
                />
                <span className="text-slate-600">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <FloatingElement delay={0.2}>
            <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/b4qywInE_hi-VPAw6W_pS.jpg" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-252 h-75 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          />
          </FloatingElement>
        </motion.div>
      </div>
      
    )
  },
  {
    id: 9,
    title: "Core Technologies: Robust and Reliable Foundation",
    transition: cubeVariants,
    content: (
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm"
          >
            <GlowEffect>
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
                <Server size={32} />
              </div>
            </GlowEffect>
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Microsoft SQL Server</h4>
              <p className="text-sm text-slate-500">High-performance database for all recruitment data</p>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-slate-900">Additional Technologies</h5>
            <motion.ul className="space-y-3">
              {[
                "Cloud-native architecture for flexibility",
                "API integrations for existing HR systems",
                "Machine learning frameworks for automation"
              ].map((tech, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 text-slate-600"
                >
                  <motion.div
                    animate={{ 
                      x: [0, 5, 0],
                      transition: { duration: 2, repeat: Infinity, delay: idx * 0.5 }
                    }}
                  >
                    <ChevronRight size={16} className="text-indigo-600" />
                  </motion.div>
                  <span>{tech}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          className="relative"
        >
          <FloatingElement delay={0.2}>
            <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/x47VX06KaBJNjhtSeun46.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-120 h-140 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          />
          </FloatingElement>
        </motion.div>
      </div>
    )
  },
  {
    id: 10,
    title: "Database Architecture Deep-Dive",
    transition: fadeZoomVariants,
    isERTour: true, // Special flag for our custom renderer
    content: (
      <div className="relative h-full w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
        <DataStream />
        {/* This component is defined below */}
        <ERInteractiveTour /> 
      </div>
    )
  },
  {
    id: 11,
    title: "Performance & Scalability",
    transition: pageFlipVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              value: 1,
              label: "Response Time",
              description: "For candidate matching",
              color: "emerald",
              unit: "s",
              delay: 0.1
            },
            {
              value: 1,
              label: "Applications",
              description: "Support for large-scale operations",
              color: "indigo",
              unit: "M+",
              delay: 0.2
            },
            {
              value: 99.9,
              label: "Uptime",
              description: "Target for system availability",
              color: "amber",
              unit: "%",
              delay: 0.3
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ y: 60, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: metric.delay,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="p-8 bg-white border border-slate-100 rounded-3xl text-center shadow-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-indigo-500/10 group-hover:to-indigo-500/5 transition-all duration-500" />
              <motion.div 
                className={`text-5xl font-black text-${metric.color}-600 mb-3`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: metric.delay + 0.3 }}
              >
                {metric.value}
                <span className="text-3xl">{metric.unit}</span>
              </motion.div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{metric.label}</h4>
              <p className="text-sm text-slate-500">{metric.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <FloatingElement delay={0.2}>
            <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/Gz0P3SBn--MVi8DwiYEUa.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-260 h-80 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          /></FloatingElement>
        </motion.div>
      </div>
    )
  },
  {
    id: 12,
    title: "Technical Achievements & Business Impact",
    transition: slideVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <HolographicCard className="h-72">
            <div className="p-8 h-full">
              <h4 className="text-2xl font-bold text-slate-900 mb-8">Key Technical Milestones</h4>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 20, label: "Normalized Tables", color: "indigo" },
                  { value: 16, label: "Materialized Views", color: "emerald" },
                  { value: 7, label: "Stored Procedures", color: "amber" },
                  { value: "Full", label: "Audit Trail", color: "cyan" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-center"
                  >
                    <div className={`text-4xl font-black text-${item.color}-600 mb-2`}>
                      {item.value}
                    </div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </HolographicCard>
          
          <HolographicCard className="h-72">
            <div className="p-8 h-full">
              <h4 className="text-2xl font-bold text-slate-900 mb-8">Expected Business Outcomes</h4>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 40, label: "Time-to-Hire Reduction", color: "emerald" },
                  { value: 60, label: "Candidate Quality Improvement", color: "indigo" },
                  { value: 90, label: "Compliance Violation Reduction", color: "amber" },
                  { value: 30, label: "Recruiter Productivity Increase", color: "cyan" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-center"
                  >
                    <div className={`text-4xl font-black text-${item.color}-600 mb-2`}>
                      {item.value}%
                    </div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </HolographicCard>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-gradient-to-r from-indigo-50 to-white rounded-2xl border border-indigo-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Measurable Results</h4>
              <p className="text-sm text-slate-500">Production-tested with enterprise-grade performance</p>
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                transition: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
            >
              <Binary size={32} className="text-indigo-600" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 13,
    title: "NexHire Frontend Implementation",
    transition: fadeZoomVariants,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm"
            >
              <h4 className="text-[11px] font-black uppercase text-indigo-600 mb-3">Technology Stack</h4>
              <p className="text-lg font-bold text-slate-900 leading-tight mb-2">React 18 + Express.js</p>
              <p className="text-sm text-slate-500">Modern frontend with robust backend API</p>
            </motion.div>
            
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm"
            >
              <h4 className="text-[11px] font-black uppercase text-indigo-600 mb-3">Visual Design</h4>
              <p className="text-lg font-bold text-slate-900 leading-tight mb-2">Tailwind CSS + Recharts</p>
              <p className="text-sm text-slate-500">Clean interface with data visualization</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-indigo-50 rounded-2xl"
            >
              <p className="text-sm text-slate-600 italic">
                "A sophisticated React application with three distinct role-based dashboards"
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 45 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="relative"
          >
            <FloatingElement delay={0.1}>
              <img 
            src="https://raw.githubusercontent.com/nkhondokar2420136-creator/recruitment-web/refs/heads/main/img/B4slmnSdbMDlSl5yHptTd.png" // or use local: "/images/logo.gif"
            alt="NexHire Logo"
            className="w-120 h-120 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          />
            </FloatingElement>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 14,
    title: "Flow Chart of NexHire's Frontend",
    transition: fadeZoomVariants,
    isERTour2: true, // Special flag for our custom renderer
    content: (
      <div className="relative h-full w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
        <DataStream />
        {/* This component is defined below */}
        <ERInteractiveTour2 /> 
      </div>
    )
  },
  {
    id: 15,
    title: "Conclusion: NexHire's Strengths & Future",
    transition: cubeVariants,
    content: (
      <div className="grid grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="space-y-8"
        >
          <h4 className="text-2xl font-bold text-slate-900">Key Strengths</h4>
          <div className="space-y-4">
            {[
              "Enterprise-Ready: Production-tested with error handling",
              "Scalable Architecture: Supports millions of records",
              "Compliance-First: Built-in GDPR and audit requirements",
              "Intelligent Matching: Advanced algorithms for candidate selection",
              "Transparent Operations: Full audit trails and explainable decisions"
            ].map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex gap-4 items-start p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    transition: { duration: 4, repeat: Infinity, delay: index * 0.5 }
                  }}
                >
                  <Award size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                </motion.div>
                <span className="text-sm text-slate-600">{strength}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="space-y-8"
        >
          <h4 className="text-2xl font-bold text-slate-900">Future Enhancements</h4>
          <div className="space-y-4">
            {[
              {
                title: "Employee Management (HRMS)",
                priority: "High Priority",
                progress: 75,
                color: "rose"
              },
              {
                title: "Machine Learning Predictive Scoring",
                priority: "High Priority",
                progress: 50,
                color: "rose"
              },
              {
                title: "API Gateway Development",
                priority: "High Priority",
                progress: 33,
                color: "rose"
              },
              {
                title: "Mobile Optimization",
                priority: "Medium Priority",
                progress: 25,
                color: "amber"
              },
              {
                title: "Real-time Collaboration",
                priority: "Medium Priority",
                progress: 15,
                color: "amber"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">{item.title}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.color === 'rose' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    {item.priority}
                  </span>
                </div>
                <AnimatedProgressBar 
                  progress={item.progress} 
                  color={item.color === 'rose' ? 'rose' : 'amber'}
                  label="Development Progress"
                  delay={0.4 + index * 0.1}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }
];

export default function NexHirePresentation() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const nextSlide = () => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'f':
        case 'F':
          setIsFullscreen(!isFullscreen);
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'n':
        case 'N':
          setShowNotes(!showNotes);
          break;
        case '1': setCurrent(0); break;
        case '2': setCurrent(1); break;
        case '3': setCurrent(2); break;
        case '4': setCurrent(3); break;
        case '5': setCurrent(4); break;
        case '6': setCurrent(5); break;
        case '7': setCurrent(6); break;
        case '8': setCurrent(7); break;
        case '9': setCurrent(8); break;
        case '0': setCurrent(9); break;
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, isFullscreen, showNotes]);

  useEffect(() => {
    if (isFullscreen) {
      document.documentElement.requestFullscreen().catch(console.log);
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.log);
    }
  }, [isFullscreen]);

  const currentSlide = SLIDES[current];
  const transitionVariants = currentSlide.transition || slideVariants;

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 overflow-hidden ${isDark ? 'dark' : ''}`}>
      <div className="absolute inset-0 overflow-hidden">
        <DataStream />
        <ParticleField count={15} />
      </div>

      

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 pt-24 pb-24 relative">
        {/* Presentation Canvas */}
        <div className="w-full max-w-6xl aspect-[16/10] bg-white rounded-[48px] shadow-[0_40px_80px_-15px_rgba(15,23,42,0.08)] border border-slate-100 relative overflow-hidden flex flex-col">
          <div className="flex-1 p-12 md:p-16 flex flex-col relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={transitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="h-full w-full absolute inset-0 p-12 md:p-16"
              >
                {currentSlide.title && (
                  <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"
                  >
                    <motion.div 
                      className="w-12 h-px bg-gradient-to-r from-indigo-600 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                    {currentSlide.title}
                  </motion.h2>
                )}
                
                {currentSlide.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated Progress Bar */}
          <div className="h-2 w-full bg-slate-50 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: ((current + 1) / SLIDES.length) }}
              transition={{ duration: 0.8, ease: "circOut" }}
              style={{ transformOrigin: "left" }}
            />
            <motion.div 
              className="absolute top-0 h-full w-4 bg-white/50"
              animate={{ 
                x: ["0%", "100%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                x: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                },
                opacity: {
                  duration: 1,
                  repeat: Infinity
                }
              }}
            />
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="mt-10 flex flex-col items-center gap-8">
          <div className="flex items-center gap-8">
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="p-4 rounded-full bg-white border border-slate-200 shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition-all disabled:opacity-20 group"
              disabled={current === 0}
            >
              <ChevronLeft size={24} />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Prev
              </div>
            </motion.button>

            <motion.div 
              className="bg-white px-10 py-3 rounded-full border border-slate-200 shadow-sm font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4"
              animate={{ 
                scale: [1, 1.02, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              Slide <span className="text-slate-900 text-sm">{current + 1}</span> / {SLIDES.length}
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="p-4 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-20 group"
              disabled={current === SLIDES.length - 1}
            >
              <ChevronRight size={24} />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] text-white font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Next
              </div>
            </motion.button>
          </div>

          {/* Slide Dots with Animation */}
          <div className="flex gap-3">
            {SLIDES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.8 }}
                className={`w-3 h-3 rounded-full transition-all relative ${
                  i === current 
                    ? 'bg-indigo-600' 
                    : i < current 
                    ? 'bg-indigo-300' 
                    : 'bg-slate-300'
                }`}
              >
                {i === current && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-600"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.5 }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Keyboard Shortcuts */}
          <motion.div 
            className="flex gap-6 text-[10px] text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-mono">← →</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-mono">F</kbd>
              <span>Fullscreen</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-mono">1-9</kbd>
              <span>Jump to slide</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-mono">N</kbd>
              <span>Notes</span>
            </div>
          </motion.div>
        </div>
      </div>

      
      {/* Speaker Notes Modal */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-8"
            onClick={() => setShowNotes(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em]">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      transition: { duration: 4, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <PlayCircle size={16} />
                  </motion.div>
                  Speaker Notes
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotes(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X size={18} />
                </motion.button>
              </div>
              
              <div className="prose prose-sm text-slate-600">
                <h3 className="text-slate-900 mb-4">Slide {current + 1}: {currentSlide.title || "Introduction"}</h3>
                <motion.p 
                  className="leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {current === 0 && "Good morning/afternoon everyone. Today we will be presenting NexHire, an Intelligent Recruitment Management System. NexHire is designed to address the growing complexity of modern hiring by combining automation, data-driven decision making, and compliance-focused system design. Our objective is to help organizations hire the right talent faster, more fairly, and in full compliance with data protection regulations."}
                  {current === 1 && "Recruitment has changed dramatically in recent years. Organizations now receive an overwhelming number of applications, often across multiple platforms. At the same time, companies are expected to ensure fair hiring practices, reduce operational costs, and strictly protect candidate data. Traditional recruitment tools are no longer sufficient to manage these combined challenges effectively."}
                  {current === 2 && "Introducing NexHire - our comprehensive solution that addresses these challenges through intelligent automation, advanced analytics, and seamless workflow integration. This represents a paradigm shift in recruitment technology."}
                  {current === 3 && "Our architectural decisions prioritize scalability, security, and user experience. We've built a foundation that supports enterprise-grade requirements while maintaining flexibility for future enhancements."}
                  {current === 4 && "The core operational features demonstrate NexHire's capability to handle complex recruitment workflows while maintaining data integrity and compliance across all stages of the hiring process."}
                  {current === 5 && "NexHire covers the complete hiring lifecycle, providing specialized tools for each stakeholder - from candidates and recruiters to administrators and compliance officers."}
                  {current === 6 && "These innovations redefine what's possible in recruitment technology. Our intelligent matching engine and automated workflows significantly reduce manual effort while improving decision quality."}
                  {current === 7 && "Analytics and compliance are built into the system's DNA. We provide tools for ethical hiring practices while delivering actionable insights for continuous improvement."}
                  {current === 8 && "The system is built on a robust technology stack. At the core is Microsoft SQL Server, which ensures data consistency, high performance, and concurrency safety. The platform is cloud-native and supports API integrations, allowing it to scale easily and integrate with existing HR or enterprise systems."}
                  {current === 10 && "NexHire is designed to perform at enterprise scale. It delivers sub-second response times for candidate matching, supports over one million applications, and targets 99.9% system availability. These performance goals ensure reliability even under heavy recruitment workloads."}
                  {current === 11 && "From a technical perspective, NexHire includes a fully normalized database schema with strong referential integrity. Stored procedures encapsulate business logic, while materialized views support real-time analytics. A complete change-tracking and audit system ensures transparency and maintainability."}
                  {current === 12 && "The modern interface provides intuitive, role-specific experiences that surface relevant information and streamline workflows for each user type."}
                  {current === 13 && "The frontend of NexHire is built using React with a component-based architecture. A single login system redirects users based on roles: Admin, Recruiter, or Candidate. The Admin dashboard provides system analytics, user management, and compliance monitoring. The Recruiter dashboard displays ranked candidate matches generated by the backend. Recruiters can create jobs, schedule interviews, and update hiring stages. The Candidate dashboard allows profile creation, skill updates, and job applications. Application status is shown using real-time visual progress indicators. All actions communicate with the backend through secure RESTful APIs Business logic remains in the backend, keeping the frontend clean and secure. The interface is responsive, user-friendly, and optimized for productivity"}
                  {current === 14 && "To conclude, NexHire is an enterprise-ready, scalable, and compliance-first recruitment solution. It combines intelligent matching, automation, analytics, and ethical hiring practices into a single platform. Future enhancements include expanding NexHire into a full HR management system, applying machine learning for predictive hiring, and enabling real-time collaboration between recruiters."}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition Overlay Animation */}
      <AnimatePresence>
        {direction !== 0 && (
          <motion.div
            key="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 mix-blend-overlay pointer-events-none z-40"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
