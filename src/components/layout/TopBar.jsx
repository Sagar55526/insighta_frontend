import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, MessageSquare } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const TopBar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-[60] glass border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-200">
                                <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Insighta</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 ml-10 items-center space-x-8">
                        {isAuthenticated && (
                            <>
                                <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Chat</Link>
                                <Link to="/upload" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Upload</Link>
                                <Link to="/schema" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Schema</Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden sm:flex items-center text-sm font-medium text-slate-700 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200/50">
                                    <User className="h-4 w-4 mr-2 text-primary-600" />
                                    <span>{user?.name || user?.email}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="rounded-xl">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/20">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
