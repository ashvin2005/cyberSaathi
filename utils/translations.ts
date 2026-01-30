export type Language = "English" | "Spanish" | "French" | "German" | "Hindi" | "Marathi";

type Translation = {
    sendButton: string;
    sending: string;
    wait: string;
    placeholder: string;
    error: string;
    defaultTitle: string;
    noMessages: string;
    startChatting: string;
    micStart: string;
    micStop: string;
    readAloud: string;
    stopReading: string;
};

export const translations: Record<Language, Translation> = {
    English: {
        sendButton: "Send",
        sending: "Sending...",
        wait: "Wait...",
        placeholder: "Type a message...",
        error: "Sorry, something went wrong.",
        defaultTitle: "SafeChat",
        noMessages: "No messages yet.",
        startChatting: "Start chatting!",
        micStart: "Start listening",
        micStop: "Stop listening",
        readAloud: "Read aloud",
        stopReading: "Stop reading",
    },
    Spanish: {
        sendButton: "Enviar",
        sending: "Enviando...",
        wait: "Espera...",
        placeholder: "Escribe un mensaje...",
        error: "Lo siento, algo salió mal.",
        defaultTitle: "ChatSeguro",
        noMessages: "No hay mensajes aún.",
        startChatting: "¡Empieza a chatear!",
        micStart: "Empezar a escuchar",
        micStop: "Dejar de escuchar",
        readAloud: "Leer en voz alta",
        stopReading: "Dejar de leer",
    },
    French: {
        sendButton: "Envoyer",
        sending: "Envoi...",
        wait: "Attendez...",
        placeholder: "Tapez un message...",
        error: "Désolé, une erreur s'est produite.",
        defaultTitle: "ChatSécurisé",
        noMessages: "Pas encore de messages.",
        startChatting: "Commencez à discuter !",
        micStart: "Commencer à écouter",
        micStop: "Arrêter d'écouter",
        readAloud: "Lire à haute voix",
        stopReading: "Arrêter de lire",
    },
    German: {
        sendButton: "Senden",
        sending: "Senden...",
        wait: "Warten...",
        placeholder: "Nachricht eingeben...",
        error: "Entschuldigung, etwas ist schief gelaufen.",
        defaultTitle: "SichererChat",
        noMessages: "Noch keine Nachrichten.",
        startChatting: "Beginnen Sie zu chatten!",
        micStart: "Zuhören starten",
        micStop: "Zuhören stoppen",
        readAloud: "Vorlesen",
        stopReading: "Vorlesen stoppen",
    },
    Hindi: {
        sendButton: "भेजें",
        sending: "भेज रहा है...",
        wait: "रुको...",
        placeholder: "एक संदेश लिखें...",
        error: "क्षमा करें, कुछ गलत हो गया।",
        defaultTitle: "सुरक्षित चैट",
        noMessages: "अभी तक कोई संदेश नहीं।",
        startChatting: "चैट शुरू करें!",
        micStart: "सुनना शुरू करें",
        micStop: "सुनना बंद करें",
        readAloud: "जोर से पढ़ें",
        stopReading: "पढ़ना बंद करें",
    },
    Marathi: {
        sendButton: "पाठवा",
        sending: "पाठवत आहे...",
        wait: "थांबा...",
        placeholder: "संदेश टाइप करा...",
        error: "क्षमस्व, काहीतरी चूक झाली.",
        defaultTitle: "सुरक्षित गप्पा",
        noMessages: "अद्याप कोणतेही संदेश नाहीत.",
        startChatting: "गप्पा मारण्यास सुरवात करा!",
        micStart: "ऐकणे सुरू करा",
        micStop: "ऐकणे थांबवा",
        readAloud: "मोठ्याने वाचा",
        stopReading: "वाचणे थांबवा",
    },
};
