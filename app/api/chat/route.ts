import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, projectContext } =
      await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationContext = conversationHistory
        .map(
          (msg: Message) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
        )
        .join("\n\n");
    }

    // Build prompt with project context if available
    const prompt = `Kamu adalah CodeSensei AI Assistant, asisten coding yang membantu developer memahami project mereka.

${projectContext ? `\n**Project Context:**\n${projectContext}\n` : ""}

${conversationContext ? `**Conversation History:**\n${conversationContext}\n\n` : ""}

**User Question:**
${message}

**Instructions:**
- Jawab dalam bahasa Indonesia yang mudah dipahami
- Berikan penjelasan yang jelas dan terstruktur
- Jika pertanyaan tentang kode, berikan contoh jika diperlukan
- Gunakan analogi jika membantu pemahaman
- Jika tidak yakin atau pertanyaan diluar konteks project, katakan dengan jujur

**Response:**`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      data: {
        message: text,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate chat response";
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
