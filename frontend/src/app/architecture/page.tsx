'use client';

import { motion } from 'framer-motion';
import { 
  Server, Database, Cpu, HardDrive, 
  ArrowRight, FileAudio, Waves, FileText, 
  RefreshCw, CheckCircle2, AlertCircle,
  Github, Layout, Layers, Clock, Zap,
  ShieldAlert, Cloud, Activity, Search,
  Lock, GitBranch, Terminal, Globe
} from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const dataFlowSteps = [
  {
    icon: <FileAudio className="w-6 h-6 text-blue-500" />,
    title: "1. Upload",
    desc: "User uploads audio via drag-and-drop. Frontend sends multipart POST to /api/notes/upload with progress bar."
  },
  {
    icon: <HardDrive className="w-6 h-6 text-indigo-500" />,
    title: "2. Initial Save",
    desc: "Backend saves file to ./uploads with UUID, creates DB record ('pending'). Returns HTTP 200 immediately."
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-purple-500" />,
    title: "3. Background Task",
    desc: "FastAPI BackgroundTasks kicks off process_audio_note() without blocking the user."
  },
  {
    icon: <Waves className="w-6 h-6 text-pink-500" />,
    title: "4. Chunking & Transcription",
    desc: "Status -> 'transcribing'. Audio split into 25s chunks by pydub. Sent sequentially to Gnani ASR API with exponential backoff."
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-amber-500" />,
    title: "5. Summarization",
    desc: "Status -> 'summarizing'. Full joined transcript sent to Google Gemini API with structured Markdown prompt."
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    title: "6. Completion",
    desc: "Status -> 'completed'. Transcript + summary saved. Frontend polling (2s) updates UI in real-time."
  }
];

// Helper icon component to avoid adding another import
function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
      <path d="M16 8V5c0-1.1.9-2 2-2" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 0 2-2v-5" />
      <path d="M12 8h8" />
    </svg>
  );
}

export default function ArchitecturePage() {
  return (
    <Container className="py-12 max-w-6xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-16"
      >
        {/* Hero Section */}
        <motion.div variants={fadeIn} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4">
            <Layers className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">System Architecture</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A deep dive into the technical design, data flow, and engineering decisions behind the Audio Notes Platform.
          </p>
          <div className="flex justify-center pt-4">
            <Link 
              href="https://github.com/prateek31-ops/Gnani_ai_project" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors font-medium backdrop-blur-sm"
            >
              <Github className="w-5 h-5" />
              View Source on GitHub
            </Link>
          </div>
        </motion.div>

        {/* Data Flow Visualization */}
        <motion.section variants={fadeIn} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold flex items-center justify-center gap-3">
              <Activity className="w-7 h-7 text-blue-400" />
              Data Flow Pipeline
            </h2>
            <p className="text-muted-foreground mt-2">End-to-end lifecycle of an audio note</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {dataFlowSteps.map((step, index) => (
              <Card key={index} className="p-6 bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="text-8xl font-black">{index + 1}</div>
                </div>
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Core Architecture Concepts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Long Audio Handling */}
          <motion.section variants={fadeIn}>
            <Card className="p-8 h-full bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-semibold">Long Audio Handling</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Chunking Strategy:</strong> Audio is split into 25-second WAV chunks using <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">pydub</code> to stay within the Gnani API 30s limit.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Sequential Processing:</strong> Chunks are processed sequentially with an exponential backoff retry mechanism (up to 6 attempts per chunk) to handle 429 Rate Limit errors.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Graceful Degradation:</strong> If a single chunk ultimately fails, it returns an empty string while the rest continue, ensuring the user still gets a partial transcript instead of a complete failure.</span>
                </li>
              </ul>
            </Card>
          </motion.section>

          {/* Async vs Sync */}
          <motion.section variants={fadeIn}>
            <Card className="p-8 h-full bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-semibold">Async vs Sync Execution</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Non-Blocking (Async)
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                    <li>File upload handling (<code className="bg-white/10 px-1 py-0.5 rounded">aiofiles</code>)</li>
                    <li>Database operations (SQLAlchemy async + aiosqlite)</li>
                    <li>Gnani API calls (<code className="bg-white/10 px-1 py-0.5 rounded">httpx.AsyncClient</code>)</li>
                    <li>The entire pipeline runs as a FastAPI <code className="bg-white/10 px-1 py-0.5 rounded">BackgroundTask</code></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-medium mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Blocking (Sync / ThreadPool)
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                    <li>Audio chunking (CPU-bound <code className="bg-white/10 px-1 py-0.5 rounded">pydub</code> ops) run via <code className="bg-white/10 px-1 py-0.5 rounded">run_in_executor()</code></li>
                    <li>Gemini API calls (Sync SDK) run via <code className="bg-white/10 px-1 py-0.5 rounded">run_in_executor()</code></li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.section>
        </div>

        {/* Resilience & Error Handling */}
        <motion.section variants={fadeIn}>
          <Card className="p-8 bg-gradient-to-r from-rose-500/5 via-orange-500/5 to-amber-500/5 border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <h2 className="text-2xl font-semibold">Resilience & Error Handling</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-rose-400">
                  <FileAudio className="w-4 h-4" /> Validation
                </h4>
                <p className="text-sm text-muted-foreground">Strict file extension and size validation before saving to disk.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-orange-400">
                  <RefreshCw className="w-4 h-4" /> Rate Limits
                </h4>
                <p className="text-sm text-muted-foreground">Exponential backoff for Gnani API handles high concurrency smoothly.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-amber-400">
                  <AlertCircle className="w-4 h-4" /> Quotas
                </h4>
                <p className="text-sm text-muted-foreground">LLM API quota exceedences trigger graceful error messages in the summary panel.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-red-400">
                  <Terminal className="w-4 h-4" /> Visibility
                </h4>
                <p className="text-sm text-muted-foreground">All pipeline errors are caught, status set to 'failed', and message displayed to user.</p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Tech Stack Grid */}
        <motion.section variants={fadeIn} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Technology Stack</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Layout />, name: "Next.js 14", desc: "App Router & React 18" },
              { icon: <Terminal />, name: "FastAPI", desc: "Async Python Backend" },
              { icon: <Database />, name: "SQLite", desc: "SQLAlchemy & aiosqlite" },
              { icon: <Globe />, name: "TailwindCSS", desc: "Styling & Framer Motion" },
              { icon: <BrainCircuit />, name: "Gnani API", desc: "ASR Transcription" },
              { icon: <BrainCircuit />, name: "Groq API", desc: "LLM Summarization (Qwen)" },
              { icon: <Waves />, name: "pydub", desc: "Audio Processing" },
              { icon: <HardDrive />, name: "Local FS", desc: "File Storage" },
            ].map((tech, i) => (
              <Card key={i} className="p-4 flex items-center gap-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-muted-foreground">{tech.icon}</div>
                <div>
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.desc}</div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* What I'd Do Differently */}
        <motion.section variants={fadeIn}>
          <Card className="p-8 border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-12 -top-12 opacity-10">
              <GitBranch className="w-48 h-48 text-indigo-500" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <RocketIcon className="w-6 h-6 text-indigo-400" />
                What I'd Do With More Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Database className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block mb-1">Production Database</strong>
                      <span className="text-sm text-muted-foreground">Migrate from SQLite to PostgreSQL for better concurrency and production readiness.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Cloud className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block mb-1">Cloud Storage</strong>
                      <span className="text-sm text-muted-foreground">Move audio files from the local filesystem to AWS S3 or Google Cloud Storage.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <RefreshCw className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block mb-1">Real-time WebSockets</strong>
                      <span className="text-sm text-muted-foreground">Replace 2-second HTTP polling with WebSockets for instant, low-overhead progress updates.</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block mb-1">Authentication</strong>
                      <span className="text-sm text-muted-foreground">Add user accounts (NextAuth) so users can manage their own private notes.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Search className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block mb-1">Full-Text Search</strong>
                      <span className="text-sm text-muted-foreground">Implement search functionality across all transcripts and summaries.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="block mb-1">Streaming Responses</strong>
                      <span className="text-sm text-muted-foreground">Stream the Groq summary generation in real-time to the UI as it's being written.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      </motion.div>
    </Container>
  );
}

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 3.82-13 1.5 1.5 0 0 0-2.18-2.18A22 22 0 0 1 8 5M15 12l3 3" />
      <path d="M8.5 8.5 15.5 15.5" />
      <path d="m22 2-7 7" />
    </svg>
  );
}
