import { NoteStatus } from "@/types/note";
import { CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: NoteStatus;
  className?: string;
  showText?: boolean;
}

const statusConfig: Record<
  NoteStatus,
  { icon: React.ReactNode; text: string; color: string; bg: string }
> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    text: "Pending",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  uploading: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    text: "Uploading",
    color: "text-sky-500",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  transcribing: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    text: "Transcribing",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  summarizing: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    text: "Summarizing",
    color: "text-purple-500",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  completed: {
    icon: <CheckCircle className="w-4 h-4" />,
    text: "Completed",
    color: "text-green-500",
    bg: "bg-green-500/10 border-green-500/20",
  },
  failed: {
    icon: <AlertCircle className="w-4 h-4" />,
    text: "Failed",
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/20",
  },
};

export function StatusIndicator({
  status,
  className,
  showText = true,
}: StatusIndicatorProps) {
  const current = statusConfig[status] ?? statusConfig.pending;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
        current.color,
        current.bg,
        className
      )}
    >
      {current.icon}
      {showText && <span>{current.text}</span>}
    </div>
  );
}
