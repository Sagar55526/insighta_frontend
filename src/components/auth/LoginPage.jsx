import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Layout from '../layout/Layout';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto w-full pt-10 pb-16">
                <div className="glass p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/40">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20 mb-4">
                            <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 mt-2 font-medium">Continue your journey with Insighta</p>
                    </div>

                    {error && (
                        <div className="bg-red-50/50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="rounded-xl border-slate-200 focus:ring-primary-600 focus:border-primary-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="rounded-xl border-slate-200 focus:ring-primary-600 focus:border-primary-600"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-lg shadow-primary-600/20 transition-all duration-300 font-bold text-base active:scale-[0.98]"
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="mt-10 text-center text-sm">
                        <span className="text-slate-500 font-medium">Don't have an account? </span>
                        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LoginPage;
