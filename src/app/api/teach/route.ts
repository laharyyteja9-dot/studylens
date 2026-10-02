import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const { explanation, concept } = await req.json();

    const schema = {
      type: "object",
      properties: {
        understanding: { type: "number" },
        accuracy: { type: "number" },
        completeness: { type: "number" },
        missing: { type: "array", items: { type: "string" } },
        feedback: { type: "string" }
      },
      required: ["understanding", "accuracy", "completeness", "missing", "feedback"]
    };

    const prompt = `
You are evaluating a student's explanation of a concept.
Grade it ONLY against the provided source material, not outside knowledge.
Return scores (0-100) for understanding, accuracy, and completeness.
List any key points missing from the source material.
Provide exactly one encouraging, specific sentence of feedback.

Concept: \${concept.name}
Source Excerpt: "\${concept.sourceExcerpt}"
Student's Explanation: "\${explanation}"
    `;

    const result = await callGeminiJSON(prompt, schema);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
