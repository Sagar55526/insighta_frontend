import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ChatInterface from './components/chat/ChatInterface';
import FileUpload from './components/upload/FileUpload';
import SchemaEditor from './components/schema/SchemaEditor';
import Layout from './components/layout/Layout';
import FullScreenLayout from './components/layout/FullScreenLayout';

// Protected Route Component
const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Wrapper for pages that use standard layout
const LayoutWrapper = ({ children }) => {
    return <Layout>{children}</Layout>;
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<ProtectedRoute />}>
                        {/* Chat Interface - Uses FullScreenLayout for better experience */}
                        <Route path="/" element={
                            <FullScreenLayout>
                                <ChatInterface />
                            </FullScreenLayout>
                        } />

                        <Route path="/upload" element={
                            <LayoutWrapper>
                                <FileUpload />
                            </LayoutWrapper>
                        } />

                        <Route path="/schema" element={
                            <LayoutWrapper>
                                <SchemaEditor />
                            </LayoutWrapper>
                        } />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
