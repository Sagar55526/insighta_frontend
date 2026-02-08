import React, { useRef, useEffect } from 'react';
import { Bot, User as UserIcon } from 'lucide-react';
import Loading from '../common/Loading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageList = ({ messages, isLoading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 flex flex-col w-full max-w-4xl mx-auto custom-scrollbar">
            {messages.map((message) => (
                <div
                    key={message.id || Math.random()}
                    className={`flex gap-4 max-w-3xl w-full animate-in fade-in slide-in-from-bottom-2 duration-500 ${message.is_bot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110
            ${message.is_bot ? 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white shadow-primary-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}
                    >
                        {message.is_bot ? <Bot className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>

                    <div className={`flex-1 min-w-0 max-w-[85%] ${message.is_bot ? '' : 'flex justify-end'}`}>
                        <div className={`p-5 rounded-2xl space-y-3 transition-all duration-300
                ${message.is_bot
                                ? 'bg-white text-slate-800 border border-slate-100 shadow-sm hover:shadow-md'
                                : 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                            }
             `}>
                            {message.is_thinking ? (
                                <div className="space-y-3">
                                    {(message.thoughts || []).map((thought, idx) => (
                                        <div key={idx} className="flex items-start space-x-3 text-slate-400 italic text-sm animate-in slide-in-from-left-2 duration-300">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0"></div>
                                            <span className="leading-relaxed">{thought}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center space-x-3 text-primary-500 italic text-sm bg-primary-50/50 py-2 px-3 rounded-xl border border-primary-100/50 w-fit">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                                        </div>
                                        <span className="font-medium">Synthesizing intelligence...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={`prose prose-sm max-w-none leading-relaxed
                        ${message.is_bot ? 'prose-slate' : 'prose-invert'}
                    `}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {message.graphs && message.graphs.length > 0 && (
                                <div className={`mt-3 pt-3 border-t ${message.is_bot ? 'border-slate-100' : 'border-white/10'} text-xs font-medium uppercase tracking-wider opacity-60`}>
                                    Visualization available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full mr-auto animate-pulse">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="flex-1 max-w-[120px]">
                        <div className="h-12 bg-slate-100 rounded-2xl border border-slate-50"></div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
