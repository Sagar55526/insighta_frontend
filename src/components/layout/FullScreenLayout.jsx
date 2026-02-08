import React from 'react';
import TopBar from './TopBar';

const FullScreenLayout = ({ children }) => {
    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <TopBar />
            <main className="flex-1 flex overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default FullScreenLayout;
