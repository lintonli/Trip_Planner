import axios from 'axios';
import type { TripRequest, TripResponse } from '../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const truckerAPI = {
  planTrip: async (tripData: TripRequest): Promise<TripResponse> => {
    const response = await api.post('/trips/plan/', tripData);
    return response.data;
  },

  getTrip: async (tripId: string) => {
    const response = await api.get(`/trips/${tripId}/`);
    return response.data;
  },

  listTrips: async () => {
    const response = await api.get('/trips/');
    return response.data;
  },

  getDailyLogPDF: async (tripId: string, date: string) => {
    const response = await api.get(`/trips/${tripId}/logs/${date}/pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
