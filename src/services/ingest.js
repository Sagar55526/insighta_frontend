import api from './api';

export const getViewSchema = async () => {
    const response = await api.get('/api/v1/ingest');
    return response.data;
};

export const updateSchema = async (schemaData) => {
    // schemaData should be { schema: [ { column_name, inferred_type, description } ] }
    const response = await api.put('/api/v1/ingest', schemaData);
    return response.data;
};
