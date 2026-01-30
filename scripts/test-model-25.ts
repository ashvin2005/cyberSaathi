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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log("Testing gemini-2.5-flash...");
        const result = await model.generateContent("Hi");
        console.log("SUCCESS: gemini-2.5-flash response:", result.response.text());

    } catch (error: any) {
        console.error("FAILED: gemini-2.5-flash (" + error.status + " " + error.statusText + ")");
        console.error(error.message);
    }
}

test();
