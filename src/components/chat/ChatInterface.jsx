import React, { useState, useEffect } from 'react';
import useThreads from '../../hooks/useThreads';
import useMessages from '../../hooks/useMessages';
import ThreadSidebar from './ThreadSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Menu, X } from 'lucide-react';

const ChatInterface = () => {
    const { threads, loading: threadsLoading, fetchThreads, createThread } = useThreads();
    const { messages, loading: messagesLoading, fetchMessages, sendMessage, setMessages, subscribeToThread } = useMessages();
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        fetchThreads();
    }, [fetchThreads]);

    useEffect(() => {
        if (!currentThreadId && threads.length > 0) {
            setCurrentThreadId(threads[0].id);
        }
    }, [threads, currentThreadId]);

    useEffect(() => {
        if (currentThreadId) {
            fetchMessages(currentThreadId);
            subscribeToThread(currentThreadId);
        } else {
            setMessages([]);
        }
    }, [currentThreadId, fetchMessages, setMessages, subscribeToThread]);

    const handleSelectThread = (threadId) => {
        setCurrentThreadId(threadId);
        setMobileSidebarOpen(false);
    };

    const handleNewThread = async () => {
        try {
            const title = `New Chat ${new Date().toLocaleTimeString()}`;
            const newThread = await createThread(title);
            setCurrentThreadId(newThread.id);
            setMobileSidebarOpen(false);
        } catch (error) {
            console.error("Failed to create thread", error);
        }
    };

    const handleSendMessage = async (content) => {
        if (!currentThreadId) {
            try {
                const title = content.substring(0, 30) || 'New Chat';
                const newThread = await createThread(title);
                setCurrentThreadId(newThread.id);
                await sendMessage(newThread.id, content);
                return;
            } catch (e) {
                console.error("Auto create thread failed", e);
                return;
            }
        }
        await sendMessage(currentThreadId, content);
    };

    return (
        <div className="flex flex-1 w-full h-full overflow-hidden relative bg-slate-50/30">
            {/* Mobile Header for Sidebar Toggle */}
            <div className="md:hidden absolute top-4 left-4 z-50">
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="p-2.5 glass rounded-xl shadow-lg border border-slate-200/50 text-slate-600 active:scale-95 transition-all"
                >
                    {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-[55] w-80 glass border-r border-slate-200/50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:relative md:translate-x-0
                ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full">
                    <ThreadSidebar
                        threads={threads}
                        currentThreadId={currentThreadId}
                        onSelectThread={handleSelectThread}
                        onNewThread={handleNewThread}
                    />
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
                    onClick={() => setMobileSidebarOpen(false)}
                ></div>
            )}

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col w-full min-w-0 relative">
                <div className="flex-1 overflow-hidden flex flex-col w-full max-w-5xl mx-auto glass border-x border-slate-200/30 my-0 sm:my-6 rounded-none sm:rounded-3xl shadow-2xl shadow-slate-200/50 relative z-10">
                    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                        <MessageList
                            messages={messages}
                            isLoading={messagesLoading}
                        />
                        <div className="px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white/80 to-transparent">
                            <MessageInput
                                onSendMessage={handleSendMessage}
                                disabled={messagesLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl -z-0"></div>
            </main>
        </div>
    );
};

export default ChatInterface;
