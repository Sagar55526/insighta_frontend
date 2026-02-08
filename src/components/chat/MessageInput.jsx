import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button';

const MessageInput = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
                <div className="flex-1">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="w-full resize-none rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 shadow-sm"
                        rows="1"
                        disabled={disabled}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={!input.trim() || disabled}
                    className="h-[48px] px-6"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </form>
        </div>
    );
};

export default MessageInput;
