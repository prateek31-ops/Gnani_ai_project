"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { StatusIndicator } from "@/components/StatusIndicator";
import { WaveformAnimation } from "@/components/WaveformAnimation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Note } from "@/types/note";
import { noteApi } from "@/lib/api";
import { formatFileSize, parseUTCDate } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  Trash2,
  FileText,
  Sparkles,
  AlertTriangle,
  Clock,
  Calendar,
  FileAudio,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasToasted = useRef(false);

  const fetchNote = async () => {
    try {
      const data = await noteApi.getNote(id);
      setNote(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch note:", error);
      toast.error("Failed to load note details.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchNote();

    const intervalId = setInterval(async () => {
      const currentNote = await fetchNote();

      // Stop polling if completed or failed
      if (
        currentNote &&
        (currentNote.status === "completed" || currentNote.status === "failed")
      ) {
        clearInterval(intervalId);
        if (currentNote.status === "completed" && !hasToasted.current) {
          hasToasted.current = true;
          toast.success("Transcription and summary completed!");
        }
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      setIsDeleting(true);
      await noteApi.deleteNote(id);
      toast.success("Note deleted successfully");
      router.push("/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
      setIsDeleting(false);
    }
  };

  if (isLoading && !note) {
    return (
      <Container className="py-8">
        <div className="h-8 w-32 bg-slate-800 animate-pulse rounded-md mb-8"></div>
        <div className="h-32 bg-slate-800/50 animate-pulse rounded-xl mb-8"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-800/50 animate-pulse rounded-xl"></div>
          <div className="h-96 bg-slate-800/50 animate-pulse rounded-xl"></div>
        </div>
      </Container>
    );
  }

  if (!note) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">
          Note not found
        </h2>
        <Button onClick={() => router.push("/notes")}>Back to Notes</Button>
      </Container>
    );
  }

  const isProcessing =
    note.status === "pending" ||
    note.status === "uploading" ||
    note.status === "transcribing" ||
    note.status === "summarizing";

  const processingMessage =
    note.status === "transcribing"
      ? "Transcribing your audio..."
      : note.status === "summarizing"
        ? "Generating smart summary..."
        : "Preparing to process your audio...";

  return (
    <div className="py-8 md:py-12 flex-1">
      <Container>
        <Button
          variant="ghost"
          onClick={() => router.push("/notes")}
          className="mb-6 -ml-4 text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notes
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3 break-all">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />{" "}
                {format(parseUTCDate(note.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
              <span className="flex items-center gap-1.5">
                <FileAudio className="w-4 h-4" />{" "}
                {formatFileSize(note.file_size)}
              </span>
              <StatusIndicator status={note.status} />
            </div>
          </div>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="mb-8">
                <WaveformAnimation />
              </div>
              <h2 className="text-2xl font-semibold text-slate-200 mb-3">
                {processingMessage}
              </h2>
              <p className="text-slate-400 max-w-md">
                Our AI models are transcribing the audio and generating a smart
                summary. This usually takes a fraction of the audio duration.
              </p>

              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4 animate-pulse" />
                Auto-updating...
              </div>
            </motion.div>
          ) : note.status === "failed" ? (
            <motion.div
              key="failed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center border-red-500/20 bg-red-500/5 min-h-[400px]"
            >
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-200 mb-2">
                Processing Failed
              </h2>
              <p className="text-slate-400 max-w-md mb-6 text-red-400/80">
                {note.error_message ||
                  "An unexpected error occurred while processing your audio."}
              </p>
              <Button onClick={() => router.push("/")}>Upload New File</Button>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[calc(100vh-250px)] min-h-[600px] w-full"
            >
              <PanelGroup direction="horizontal" className="h-full w-full">
                {/* Summary Panel */}
                <Panel defaultSize={33} minSize={20} className="flex flex-col">
                  <Card className="p-6 border-purple-500/20 bg-purple-500/5 h-full relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <Sparkles className="w-24 h-24 text-purple-400" />
                    </div>
                    
                    {/* Header (Pinned) */}
                    <div className="flex items-center gap-2 mb-6 text-purple-400 relative z-10 shrink-0">
                      <Sparkles className="w-5 h-5" />
                      <h2 className="text-lg font-semibold">AI Summary</h2>
                    </div>
                    
                    {/* Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10 bg-purple-900/10 rounded-lg p-4 border border-purple-500/10">
                      <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed">
                        {note.summary ? (
                          <div className="text-slate-300">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {note.summary}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-slate-500 italic">
                            No summary generated.
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Panel>

                <PanelResizeHandle className="w-4 flex items-center justify-center cursor-col-resize group">
                  <div className="w-1 h-8 bg-slate-700 rounded-full group-hover:bg-blue-500 transition-colors" />
                </PanelResizeHandle>

                {/* Transcript Panel */}
                <Panel defaultSize={67} minSize={30} className="flex flex-col">
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-slate-200">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h2 className="text-lg font-semibold">Full Transcript</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar bg-slate-900/30 rounded-lg p-4 border border-slate-800/50">
                      {note.transcript ? (
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                          {note.transcript}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 italic">
                          Transcript empty or not generated.
                        </div>
                      )}
                    </div>
                  </Card>
                </Panel>
              </PanelGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
