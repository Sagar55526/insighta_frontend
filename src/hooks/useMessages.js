import { useState, useCallback, useRef } from 'react';
import api from '../services/api';
import { WS_BASE_URL } from '../utils/constants';

const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeWsRef = useRef(null);
    const activeThreadIdRef = useRef(null);

    const fetchMessages = useCallback(async (threadId) => {
        if (!threadId) return;
        setLoading(true);
        try {
            const response = await api.get(`/api/v1/threads/${threadId}/messages`);
            setMessages(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching messages", err);
            setError('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }, []);

    const subscribeToThread = useCallback((threadId) => {
        if (!threadId) return;
        if (activeWsRef.current && activeThreadIdRef.current === threadId) return; // Already connected

        // Close existing if different
        if (activeWsRef.current) {
            activeWsRef.current.close();
        }

        const wsUrl = `${WS_BASE_URL}/ws/messages/${threadId}`;
        const ws = new WebSocket(wsUrl);
        activeWsRef.current = ws;
        activeThreadIdRef.current = threadId;

        ws.onopen = () => {
            console.log(`Connected to WS for thread ${threadId}`);
        };

        ws.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                return;
            }

            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    // Update the message that is currently loading/thinking
                    // We assume there's only one active generation at a time per thread usually
                    if (!msg.is_loading && !msg.is_thinking) return msg;

                    if (data.type === "status") {
                        const currentThoughts = msg.thoughts || [];
                        // Avoid duplicate thoughts if necessary, but simple append is usually fine
                        return {
                            ...msg,
                            thoughts: [...currentThoughts, data.content],
                            is_loading: true,
                            is_thinking: true
                        };
                    }

                    // Handle streaming response (tokens)
                    // Backend uses "message_start" for both init and tokens based on provided snippet
                    if (data.type === "message_start") {
                        // If we were thinking, switch to responding
                        return {
                            ...msg,
                            content: (msg.is_thinking ? "" : msg.content) + (data.content || ""),
                            thoughts: [], // Clear thoughts when response starts as requested
                            is_loading: true,
                            is_thinking: false // Stop showing thinking UI, show content
                        };
                    }

                    if (data.type === "message_end") {
                        return {
                            ...msg,
                            is_loading: false,
                            is_thinking: false
                        };
                    }

                    // Fallback for previous "message" type if still used or for full response
                    if (data.type === "message") {
                        return {
                            ...msg,
                            content: data.full_respoinse || data.full_response || data.content,
                            thoughts: [],
                            is_loading: false,
                            is_thinking: false
                        };
                    }

                    if (data.type === "error") {
                        return {
                            ...msg,
                            content: data.content || "Something went wrong.",
                            thoughts: [],
                            is_loading: false,
                            is_thinking: false
                        };
                    }

                    return msg;
                })
            );
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log(`WebSocket connection closed for thread ${threadId}`);
            if (activeThreadIdRef.current === threadId) {
                activeWsRef.current = null;
                activeThreadIdRef.current = null;
            }
        };
    }, []);

    const sendMessage = async (threadId, content) => {
        try {
            const response = await api.post(`/api/v1/thread/${threadId}/messages`, { content });

            const newMessages = response.data;

            // Mark the new bot message as thinking so the WS listener knows which one to update
            const messagesWithState = newMessages.map(msg => {
                if (msg.is_bot) {
                    return { ...msg, is_thinking: true, is_loading: true, thoughts: [] };
                }
                return msg;
            });

            setMessages(prev => [...prev, ...messagesWithState]);

            // Note: We don't call streamBotResponse anymore because we assume
            // subscribeToThread was called when the thread was selected.
            // If the socket isn't open for some reason, we might miss updates,
            // but ChatInterface should ensure subscription.

            return messagesWithState;
        } catch (err) {
            console.error("Error sending message", err);
            throw err;
        }
    };

    return {
        messages,
        loading,
        error,
        fetchMessages,
        sendMessage,
        setMessages,
        subscribeToThread
    };
};

export default useMessages;
