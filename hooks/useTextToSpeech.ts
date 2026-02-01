import { useState, useEffect, useCallback } from "react";
import { Language } from "@/utils/translations";

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

export function useTextToSpeech(language: Language) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingId, setSpeakingId] = useState<string | null>(null);

    const speak = useCallback(
        (text: string, id: string) => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                // Cancel any current speaking
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                setSpeakingId(null);

                // If clicking the same message that is already speaking, we just stop (toggle behavior)
                if (speakingId === id && isSpeaking) {
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = languageToLocale[language];

                // Improve voice selection if possible
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find((v) =>
                    v.lang.startsWith(languageToLocale[language].split("-")[0])
                );
                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }

                utterance.onstart = () => {
                    setIsSpeaking(true);
                    setSpeakingId(id);
                };

                utterance.onend = () => {
                    setIsSpeaking(false);
                    setSpeakingId(null);
                };

                utterance.onerror = () => {
                    setIsSpeaking(false);
                    setSpeakingId(null);
                };

                window.speechSynthesis.speak(utterance);
            }
        },
        [language, isSpeaking, speakingId]
    );

    const cancel = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setSpeakingId(null);
        }
    }, []);

    // Sync state if speech stops externally (e.g. browser navigation)
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.speechSynthesis && !window.speechSynthesis.speaking && isSpeaking) {
                setIsSpeaking(false);
                setSpeakingId(null);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [isSpeaking]);


    return { speak, cancel, isSpeaking, speakingId };
}
