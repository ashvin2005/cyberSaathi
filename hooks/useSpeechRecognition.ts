import { useState, useEffect, useCallback } from "react";
import { Language } from "@/utils/translations";

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    onstart: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const languageToLocale: Record<Language, string> = {
    English: "en-IN",
    Hindi: "hi-IN",
    Marathi: "mr-IN",
    Tamil: "ta-IN",
    Telugu: "te-IN",
    Bengali: "bn-IN",
    Gujarati: "gu-IN",
    Kannada: "kn-IN",
    Malayalam: "ml-IN",
    Punjabi: "pa-IN",
};

export function useSpeechRecognition(language: Language) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(
        null
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = false;
                setRecognition(recognitionInstance);
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            setTranscript(""); // Reset transcript on new start
            recognition.lang = languageToLocale[language];

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event: any) => {
                const currentTranscript = event.results[0][0].transcript;
                setTranscript(currentTranscript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            try {
                recognition.start();
            } catch (e) {
                console.error("Failed to start recognition", e);
            }
        }
    }, [recognition, language]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    return { isListening, transcript, startListening, stopListening, hasRecognition: !!recognition };
}
