import axios from 'axios';
import { Note } from '../types/note';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const noteApi = {
  uploadAudio: async (file: File, onUploadProgress?: (progressEvent: any) => void): Promise<Note> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    
    // Save note ID to local storage so the user only sees their own notes
    if (typeof window !== 'undefined') {
      const myNotes = JSON.parse(localStorage.getItem('my_notes') || '[]');
      myNotes.push(response.data.id);
      localStorage.setItem('my_notes', JSON.stringify(myNotes));
    }
    
    return response.data;
  },

  getNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    
    // Filter to only show notes created by this device
    if (typeof window !== 'undefined') {
      const myNotes = JSON.parse(localStorage.getItem('my_notes') || '[]');
      return response.data.filter((note: Note) => myNotes.includes(note.id));
    }
    
    return response.data;
  },

  getNote: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
