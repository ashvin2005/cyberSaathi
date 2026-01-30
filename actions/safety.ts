"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizeInput } from "@/utils/sanitize";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function getSafetyResponse(
    prompt: string,
    language: string = "English"
): Promise<string> {
    try {

        const sanitizedPrompt = sanitizeInput(prompt);


        const systemInstruction = `You are a cyber safety expert.
Give short, simple, actionable advice.
Do not ask follow-up questions.
Reply in ${language}.`;


        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction,
        });

        const result = await model.generateContent(sanitizedPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {

        console.error("Safety Response Error:", error);

        return "I'm having trouble connecting right now. Remember: Keep your personal information private and stay safe online!";
    }
}
