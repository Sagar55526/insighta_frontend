import api from './api';

export const getViewSchema = async () => {
    // Returns a list of all schemas owned by the user
    const response = await api.get('/api/v1/ingest');
    return response.data;
};

export const updateSchema = async ({ db_id, schema }) => {
    // Payload format: { db_id: "...", schema: [...] }
    const response = await api.put('/api/v1/ingest', { db_id, schema });
    return response.data;
};
