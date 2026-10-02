import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const { concept, mode } = await req.json();

    const schema = {
      type: "object",
      properties: {
        explanation: { type: "string" }
      },
      required: ["explanation"]
    };

    let instructions = "";
    if (mode === "Simple") instructions = "Explain this concept as if I am 10 years old. Use simple analogies.";
    else if (mode === "Exam") instructions = "Explain this concept in a formal university exam answer format, structured with bullet points and key academic terms.";
    else if (mode === "Interview") instructions = "Explain this concept as if you are answering a technical interview question. Be concise, practical, and mention trade-offs or real-world usage.";

    const prompt = `
You are an expert tutor. \${instructions}
Base your explanation primarily on this source excerpt: "\${concept.sourceExcerpt}"

Concept: \${concept.name}
    `;

    const result = await callGeminiJSON(prompt, schema);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
