// Test script for Gemini API
// Run with: npx ts-node --skip-project scripts/test-gemini.ts
// Or: node scripts/test-gemini.mjs

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini API Connection...\n");

  // Check if API key exists
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is not set in .env.local");
    console.log("\nMake sure your .env.local has:");
    console.log("GEMINI_API_KEY=your_api_key_here");
    process.exit(1);
  }

  console.log(
    "✅ API Key found:",
    apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length - 5),
  );

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try different models
    const models = [
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ];

    for (const modelName of models) {
      console.log(`\n🔄 Testing model: ${modelName}`);

      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(
          'Say "Hello, CodeSensei!" in one line.',
        );
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${modelName} works!`);
        console.log(`   Response: ${text.trim()}`);

        // If we found a working model, suggest it
        console.log(
          `\n🎉 SUCCESS! Use model: "${modelName}" in your gemini.ts`,
        );
        return modelName;
      } catch (modelError) {
        const err = modelError as Error & { status?: number };
        console.log(`❌ ${modelName} failed:`);
        console.log(`   Error: ${err.message}`);
        if (err.status) console.log(`   Status: ${err.status}`);
      }
    }

    console.log("\n❌ All models failed. Please check:");
    console.log("1. Your API key is valid");
    console.log(
      "2. Generative Language API is enabled in Google Cloud Console",
    );
    console.log("3. Your project has billing enabled (if required)");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

testGeminiAPI();
