import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

async function test() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
        const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Test 1.5 Flash
        console.log("Testing gemini-1.5-flash...");
        try {
            const model15 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            await model15.generateContent("Hi");
            console.log("SUCCESS: gemini-1.5-flash is available.");
        } catch (e: any) {
            console.log("FAILED: gemini-1.5-flash (" + e.status + ")");
        }

        // Test 2.0 Flash
        console.log("Testing gemini-2.0-flash...");
        try {
            const model20 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            await model20.generateContent("Hi");
            console.log("SUCCESS: gemini-2.0-flash is available.");
        } catch (e: any) {
            console.log("FAILED: gemini-2.0-flash (" + e.status + ")");
        }

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

test();
