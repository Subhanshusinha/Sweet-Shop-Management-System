import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Login failed'
            });
            return false;
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/register', { username, email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed'
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
