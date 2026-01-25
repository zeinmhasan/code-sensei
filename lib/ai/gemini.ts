import { GoogleGenerativeAI } from "@google/generative-ai";
import { CodeExplanation, FolderExplanation } from "@/types";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export async function explainCode(
  code: string,
  context?: string,
): Promise<CodeExplanation> {
  const model = getGeminiModel();

  const prompt = `
Kamu adalah CodeSensei, asisten AI yang menjelaskan kode dengan bahasa sederhana untuk developer pemula.

Tugas: Jelaskan kode berikut dengan format:
1. **Logika Kerja**: Penjelasan step-by-step apa yang dilakukan kode ini
2. **Key Terms**: List istilah teknis penting yang muncul (max 5)
3. **Analogi**: Perumpamaan dunia nyata yang mudah dipahami

${context ? `Konteks tambahan: ${context}` : ""}

Kode:
\`\`\`
${code}
\`\`\`

Jawab dalam format JSON:
{
  "logika": "penjelasan step by step",
  "keyTerms": [
    {"term": "nama istilah", "definition": "penjelasan singkat"}
  ],
  "analogy": "perumpamaan sederhana"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]) as CodeExplanation;
    }
    return JSON.parse(text) as CodeExplanation;
  } catch {
    console.error("Failed to parse AI response");
    return {
      logika: text,
      keyTerms: [],
      analogy: "",
    };
  }
}

export async function explainFolder(
  folderName: string,
  files: string[],
  projectContext: string,
): Promise<FolderExplanation> {
  const model = getGeminiModel();

  const prompt = `
Kamu adalah CodeSensei. Jelaskan peran folder ini dalam arsitektur proyek.

Nama Folder: ${folderName}
File di dalamnya: ${files.join(", ")}
Konteks Proyek: ${projectContext}

Jawab dalam format JSON:
{
  "role": "fungsi utama folder ini",
  "relation": "hubungannya dengan bagian lain dari proyek"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]) as FolderExplanation;
    }
    return JSON.parse(text) as FolderExplanation;
  } catch {
    return {
      role: text,
      relation: "",
    };
  }
}

export async function generateChallenge(
  code: string,
  level: "easy" | "medium" | "hard",
): Promise<string> {
  const model = getGeminiModel();

  const instructions = {
    easy: "Hapus nama variabel atau parameter (1-2 tempat)",
    medium:
      "Hapus isi dari satu blok logika (contoh: isi fungsi map, atau kondisi if)",
    hard: "Hapus fungsi utama atau logika integrasi data yang krusial",
  };

  const prompt = `
Kamu adalah CodeSensei. Buat tantangan coding untuk user dengan level ${level}.

Instruksi: ${instructions[level]}

Kode asli:
${code}

Kembalikan kode yang sudah dimodifikasi dengan mengganti bagian yang dihapus dengan komentar:
// TODO: TULIS KODE DISINI

PENTING: Berikan hanya kode yang sudah dimodifikasi saja, tanpa markdown code fence (\`\`\`), tanpa nama bahasa, dan tanpa penjelasan tambahan apapun.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let modifiedCode = response.text().trim();

  // Remove markdown code fences if AI still includes them
  modifiedCode = modifiedCode.replace(/^```[\w]*\n?/g, "");
  modifiedCode = modifiedCode.replace(/\n?```$/g, "");

  return modifiedCode.trim();
}

export async function generateHint(
  code: string,
  missingPart: string,
): Promise<string> {
  const model = getGeminiModel();

  const prompt = `
Kamu adalah CodeSensei. User sedang mengerjakan tantangan dan meminta hint.

Kode lengkap:
\`\`\`
${code}
\`\`\`

Bagian yang perlu diisi: ${missingPart}

Berikan hint berupa:
1. Kata kunci yang relevan
2. Cara berpikir untuk menyelesaikannya
3. JANGAN berikan jawaban langsung

Jawab dengan bahasa yang mendorong user untuk berpikir sendiri.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Follow-up question for deeper understanding
export async function followUpQuestion(
  originalContext: string,
  question: string,
  conversationHistory?: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const model = getGeminiModel();

  const historyContext = conversationHistory
    ? conversationHistory
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "CodeSensei"}: ${msg.content}`,
        )
        .join("\n")
    : "";

  const prompt = `
Kamu adalah CodeSensei, asisten AI yang membantu developer memahami kode.

Konteks sebelumnya:
${originalContext}

${historyContext ? `Percakapan sebelumnya:\n${historyContext}\n\n` : ""}
Pertanyaan user: ${question}

Berikan jawaban yang:
1. Jelas dan mudah dipahami
2. Relevan dengan konteks yang sudah dijelaskan
3. Berikan contoh jika membantu pemahaman
4. Gunakan bahasa Indonesia yang natural

Jawab dengan format markdown yang rapi.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

interface CodeEvaluation {
  score: number;
  feedback: string;
  differences: string[];
}

export async function evaluateCode(
  originalCode: string,
  userCode: string,
): Promise<CodeEvaluation> {
  const model = getGeminiModel();

  const prompt = `
Kamu adalah CodeSensei. Evaluasi kode yang ditulis user dengan membandingkannya dengan kode asli.

Kode Asli:
\`\`\`
${originalCode}
\`\`\`

Kode User:
\`\`\`
${userCode}
\`\`\`

Berikan evaluasi dalam format JSON:
{
  "score": 0-100,
  "feedback": "kritik konstruktif: apa yang benar, apa yang kurang, saran perbaikan",
  "differences": ["list perbedaan utama antara kedua kode"]
}

Penilaian berdasarkan:
1. Kebenaran logika (50%)
2. Struktur kode (25%)
3. Best practices (25%)
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]) as CodeEvaluation;
    }
    return JSON.parse(text) as CodeEvaluation;
  } catch {
    return {
      score: 0,
      feedback: text,
      differences: [],
    };
  }
}
