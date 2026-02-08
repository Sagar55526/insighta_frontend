import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useThreads = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchThreads = useCallback(async (page = 0, limit = 20) => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/threads', {
                params: { page, limit }
            });
            setThreads(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching threads", err);
            setError('Failed to fetch threads');
        } finally {
            setLoading(false);
        }
    }, []);

    const createThread = async (title) => {
        try {
            const response = await api.post('/api/v1/threads', { title });
            setThreads(prev => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            console.error("Error creating thread", err);
            throw err;
        }
    };

    return {
        threads,
        loading,
        error,
        fetchThreads,
        createThread
    };
};

export default useThreads;
