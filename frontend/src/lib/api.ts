import axios from 'axios';
import { Note } from '../types/note';

const API_URL = 'http://localhost:8000/api';

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
    return response.data;
  },

  getNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
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
