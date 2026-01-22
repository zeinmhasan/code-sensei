// List available Gemini models
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface GeminiModel {
  name: string;
  displayName: string;
  supportedGenerationMethods?: string[];
}

async function listModels() {
  console.log("📋 Listing available Gemini models...\n");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is not set");
    process.exit(1);
  }

  try {
    // Use REST API to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Error:", JSON.stringify(error, null, 2));
      return;
    }

    const data = await response.json();

    console.log("✅ Available models:\n");

    if (data.models) {
      data.models.forEach((model: GeminiModel) => {
        if (model.supportedGenerationMethods?.includes("generateContent")) {
          console.log(`  📌 ${model.name.replace("models/", "")}`);
          console.log(`     Display: ${model.displayName}`);
          console.log(
            `     Methods: ${model.supportedGenerationMethods.join(", ")}`,
          );
          console.log("");
        }
      });
    } else {
      console.log("No models found");
    }
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

listModels();
