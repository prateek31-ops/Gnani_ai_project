"use client";

import { Container } from "@/components/layout/Container";
import { AudioUploader } from "@/components/AudioUploader";
import { Sparkles, FileText, History } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center py-12 md:py-20">
      <Container>
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Transform Your Audio Into <br className="hidden md:block" />
            <span className="text-gradient">Insights</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Upload any audio file and get AI-powered transcription and smart summaries in minutes. Fast, secure, and incredibly accurate.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AudioUploader />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-blue-400" />}
            title="Accurate Transcription"
            description="Our advanced AI models generate precise text transcripts from your audio files, handling various accents and background noises."
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-purple-400" />}
            title="Smart Summarization"
            description="Don't have time to read? Get concise, intelligent summaries that capture the core points and action items."
          />
          <FeatureCard 
            icon={<History className="w-6 h-6 text-emerald-400" />}
            title="Searchable History"
            description="All your processed notes are saved securely. Easily search through past transcripts and summaries whenever you need them."
          />
        </motion.div>
      </Container>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-slate-800/80 rounded-xl flex items-center justify-center mb-4 border border-slate-700/50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
