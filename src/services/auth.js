import api from './api';

export const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2PasswordRequestForm expects username
    formData.append('password', password);

    // The API doc shows /api/v1/auth/login takes LoginRequest schema (JSON)
    // BUT typically OAuth2/Bearer auth often uses form-data. 
    // Checking the schema: LoginRequest has email and password.
    // The endpoint /api/v1/auth/login requests application/json based on the doc.
    // "requestBody":{"content":{"application/json": ...

    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/api/v1/users/', userData);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/api/v1/users/me');
    return response.data;
};
