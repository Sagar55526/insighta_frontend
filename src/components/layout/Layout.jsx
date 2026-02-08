import React from 'react';
import TopBar from './TopBar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            <TopBar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="h-full">
                    {children}
                </div>
            </main>
            <footer className="glass border-t border-slate-200/50 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm font-medium">
                    &copy; {new Date().getFullYear()} Insighta. Crafted for excellence.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
