export type NoteStatus =
  | "pending"
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "completed"
  | "failed";

export interface Note {
  id: string;
  title: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  duration: number | null;
  transcript: string | null;
  summary: string | null;
  status: NoteStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
