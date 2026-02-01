"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { sanitizeInput } from "@/utils/sanitize";
import { getSafetyResponse } from "@/actions/safety";
import { translations, Language } from "@/utils/translations";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [language, setLanguage] = useState<Language>("English");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const t = translations[language];

    const { isListening, transcript, startListening, stopListening, hasRecognition } = useSpeechRecognition(language);
    const { speak, cancel, isSpeaking, speakingId } = useTextToSpeech(language);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
        }
    }, [transcript]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleCopy = async (content: string, id: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleClearChat = () => {
        setMessages([]);
        setInputValue("");
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading || isCooldown) return;

        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), 2000);


        const refinedInput = inputValue.trim();
        const sanitizedInput = sanitizeInput(refinedInput);

        console.log("Sanitized Input:", sanitizedInput);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: refinedInput,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {

            const responseText = await getSafetyResponse(sanitizedInput, language);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseText,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: t.error,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md border rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-lg">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-sm">{t.defaultTitle}</h2>
                    {messages.length > 0 && (
                        <button
                            onClick={handleClearChat}
                            className="text-xs px-2 py-1 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Clear conversation"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="text-xs border rounded px-2 py-1 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                    <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="Malayalam">മലയാളം (Malayalam)</option>
                    <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm">
                        <p>{t.noMessages}</p>
                        <p>{t.startChatting}</p>
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${message.role === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none"
                                }`}
                        >
                            <div className={`prose ${message.role === "user" ? "prose-invert" : "dark:prose-invert"} max-w-none text-sm leading-relaxed`}>
                                <ReactMarkdown
                                    components={{
                                        // Override default element styles if needed for tighter spacing in chat bubbles
                                        p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 last:mb-0" {...props} />
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            {message.role === "assistant" && (
                                <div className="mt-2 flex justify-start gap-2">
                                    <button
                                        onClick={() => speak(message.content, message.id)}
                                        className={`p-1.5 rounded-full transition-colors ${speakingId === message.id
                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-700"
                                            }`}
                                        title={speakingId === message.id ? t.stopReading : t.readAloud}
                                    >
                                        {speakingId === message.id ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleCopy(message.content, message.id)}
                                        className="p-1.5 rounded-full transition-colors text-zinc-500 hover:text-zinc-700 hover:bg-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-700"
                                        title="Copy to clipboard"
                                    >
                                        {copiedId === message.id ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2 rounded-2xl rounded-bl-none flex items-center gap-1">
                            <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
            >
                <div className="flex gap-2">
                    {hasRecognition && (
                        <button
                            type="button"
                            onClick={isListening ? stopListening : startListening}
                            className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isListening
                                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30 scale-110"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 hover:scale-105"
                                }`}
                            title={isListening ? t.micStop : t.micStart}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    )}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t.placeholder}
                        className="flex-1 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading || isCooldown}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full text-sm font-medium transition-colors"
                    >
                        {isCooldown ? t.wait : isLoading ? t.sending : t.sendButton}
                    </button>
                </div>
            </form>
        </div>
    );
}
