"use client";

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { NoteCard } from '@/components/NoteCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Note } from '@/types/note';
import { noteApi } from '@/lib/api';
import { FileAudio, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await noteApi.getNotes();
      setNotes(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      toast.error('Failed to load your notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="py-8 md:py-12 flex-1">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Past Notes</h1>
            <p className="text-slate-400">View and manage your transcribed audio notes.</p>
          </div>
          <Button variant="outline" onClick={fetchNotes} disabled={isLoading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-xl p-5 h-64 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="pt-4 mt-auto border-t border-slate-800/50 flex justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NoteCard note={note} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-2xl">
            <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 text-slate-500">
              <FileAudio className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-200 mb-3">No notes yet</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              You haven't uploaded any audio files yet. Start by uploading an audio file to get an AI-powered transcription and summary.
            </p>
            <Button onClick={() => window.location.href = '/'} size="lg">
              Upload Audio
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
