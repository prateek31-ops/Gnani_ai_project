"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileAudio, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { noteApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function AudioUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const note = await noteApi.uploadAudio(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setProgress(percentCompleted);
      });
      
      toast.success('File uploaded successfully!');
      router.push(`/notes/${note.id}`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50'
        } ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <AnimatePresence mode="wait">
            {!isUploading ? (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className={`p-4 rounded-full mb-6 ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400'}`}>
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">
                  {isDragActive ? 'Drop your audio here' : 'Click or drag audio to upload'}
                </h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Supports MP3, WAV, M4A, OGG up to 50MB. AI will process it instantly.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="uploading-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full max-w-sm"
              >
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-medium text-slate-200 mb-6">Uploading...</h3>
                
                <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
                  <motion.div 
                    className="bg-primary h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
                <div className="flex justify-between w-full text-sm text-slate-400">
                  <span>Processing file</span>
                  <span>{progress}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
