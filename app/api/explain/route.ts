import { NextRequest, NextResponse } from "next/server";
import { explainCode, explainFolder, followUpQuestion } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      code,
      folderName,
      files,
      projectContext,
      question,
      originalContext,
      conversationHistory,
    } = body;

    if (type === "code") {
      if (!code) {
        return NextResponse.json(
          { error: "Code is required" },
          { status: 400 },
        );
      }

      const explanation = await explainCode(code);
      return NextResponse.json({ success: true, data: explanation });
    } else if (type === "folder") {
      if (!folderName) {
        return NextResponse.json(
          { error: "Folder name is required" },
          { status: 400 },
        );
      }

      const explanation = await explainFolder(
        folderName,
        files || [],
        projectContext || "",
      );
      return NextResponse.json({ success: true, data: explanation });
    } else if (type === "followup") {
      if (!question || !originalContext) {
        return NextResponse.json(
          { error: "Question and original context are required" },
          { status: 400 },
        );
      }

      const answer = await followUpQuestion(
        originalContext,
        question,
        conversationHistory,
      );
      return NextResponse.json({ success: true, data: { answer } });
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be "code" or "folder"' },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error generating explanation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate explanation";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
