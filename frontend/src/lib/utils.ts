import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Parses a UTC datetime string from the backend (SQLite func.now() stores UTC).
 * Appends 'Z' so JavaScript correctly interprets it as UTC and converts to local time.
 */
export function parseUTCDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // If the string already has timezone info, use as-is
  if (dateStr.endsWith('Z') || dateStr.includes('+') || dateStr.includes('-', 10)) {
    return new Date(dateStr);
  }
  // Otherwise append 'Z' to mark it as UTC
  return new Date(dateStr + 'Z');
}
