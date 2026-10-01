import { Note } from '@/types/note';
import { Card } from '@/components/ui/Card';
import { StatusIndicator } from '@/components/StatusIndicator';
import { formatFileSize, parseUTCDate } from '@/lib/utils';
import { format } from 'date-fns';
import { FileAudio, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const statusColors = {
    completed: 'border-l-emerald-500',
    pending: 'border-l-yellow-500',
    uploading: 'border-l-blue-500',
    transcribing: 'border-l-blue-500',
    summarizing: 'border-l-blue-500',
    failed: 'border-l-red-500'
  };

  const borderLeftClass = statusColors[note.status as keyof typeof statusColors] || 'border-l-slate-700';

  return (
    <Link href={`/notes/${note.id}`}>
      <Card className={`p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group cursor-pointer h-full flex flex-col relative overflow-hidden border-l-4 ${borderLeftClass}`}>
        
        {/* Subtle waveform pattern in background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L5 5 L10 15 L15 2 L20 18 L25 8 L30 12 L35 0 L40 10' stroke='%238b5cf6' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundSize: '40px 20px', backgroundRepeat: 'repeat' }}></div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
              <FileAudio className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-medium text-slate-200 truncate" title={note.title}>
                {note.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {format(parseUTCDate(note.created_at), 'MMM d, yyyy h:mm a')} • {formatFileSize(note.file_size)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex-1 relative z-10">
          {note.summary ? (
            <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
              {note.summary}
            </p>
          ) : (
            <div className="h-full flex items-center justify-center py-4 text-slate-500 text-sm italic">
              {note.status === 'completed' ? 'No summary generated.' : 'Processing summary...'}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto relative z-10">
          <StatusIndicator status={note.status} />
          <div className="text-slate-500 group-hover:text-primary transition-colors flex items-center text-sm font-medium">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
