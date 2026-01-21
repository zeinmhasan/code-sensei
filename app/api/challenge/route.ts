import { NextRequest, NextResponse } from "next/server";
import { generateChallenge, generateHint, evaluateCode } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, code, level, missingPart, originalCode, userCode } = body;

    if (action === "generate") {
      if (!code || !level) {
        return NextResponse.json(
          { error: "Code and level are required" },
          { status: 400 },
        );
      }

      const modifiedCode = await generateChallenge(code, level);
      return NextResponse.json({
        success: true,
        data: { modifiedCode, originalCode: code },
      });
    } else if (action === "hint") {
      if (!code || !missingPart) {
        return NextResponse.json(
          { error: "Code and missing part description are required" },
          { status: 400 },
        );
      }

      const hint = await generateHint(code, missingPart);
      return NextResponse.json({ success: true, data: { hint } });
    } else if (action === "evaluate") {
      if (!originalCode || !userCode) {
        return NextResponse.json(
          { error: "Original code and user code are required" },
          { status: 400 },
        );
      }

      const evaluation = await evaluateCode(originalCode, userCode);
      return NextResponse.json({ success: true, data: evaluation });
    }

    return NextResponse.json(
      { error: 'Invalid action. Must be "generate", "hint", or "evaluate"' },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in challenge API:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to process challenge request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
