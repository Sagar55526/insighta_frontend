import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import Button from '../common/Button';

const ThreadSidebar = ({ threads, currentThreadId, onSelectThread, onNewThread }) => {
    return (
        <div className="w-full h-full flex flex-col bg-transparent">
            <div className="p-6">
                <Button
                    className="w-full py-3 justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-lg shadow-primary-600/20 transition-all duration-300 font-semibold text-base active:scale-[0.98]"
                    onClick={onNewThread}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Chat
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                <div className="px-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Recent Conversations
                </div>
                {threads.map((thread) => (
                    <button
                        key={thread.id}
                        onClick={() => onSelectThread(thread.id)}
                        className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 group
              ${currentThreadId === thread.id
                                ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100/50'
                                : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent'
                            }
            `}
                    >
                        <div className={`p-2 rounded-xl mr-3 transition-colors duration-300
                            ${currentThreadId === thread.id ? 'bg-white shadow-sm text-primary-600' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600'}
                        `}>
                            <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="truncate text-left flex-1">{thread.title || 'New Chat'}</span>
                    </button>
                ))}

                {threads.length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">No conversations yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreadSidebar;
