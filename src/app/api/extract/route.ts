import { NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/llm';
const pdfParse = require('pdf-parse');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const pastedText = formData.get('text') as string | null;

    let textToProcess = pastedText || '';

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      textToProcess = data.text;
    }

    if (!textToProcess.trim()) {
      return NextResponse.json({ error: 'No content found to process' }, { status: 400 });
    }

    // Cap text to protect quota (e.g. first 40,000 chars roughly 10k tokens)
    if (textToProcess.length > 40000) {
      textToProcess = textToProcess.substring(0, 40000);
    }

    const schema = {
      type: "object",
      properties: {
        concepts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              topic: { type: "string" },
              name: { type: "string" },
              summary: { type: "string" },
              sourceExcerpt: { type: "string" }
            },
            required: ["topic", "name", "summary", "sourceExcerpt"]
          }
        }
      },
      required: ["concepts"]
    };

    const prompt = `
You are an expert educational extractor. Analyze the following study material and extract the core concepts.
Identify Topics, and under each Topic, extract the key Concepts (between 15 and 30 total across all topics).
For each concept, provide:
- topic: The broader category
- name: The concept name
- summary: A clear, one-line summary
- sourceExcerpt: A short, direct quote from the text that mentions it.

Material:
${textToProcess}
    `;

    const result = await callGeminiJSON<{ concepts: any[] }>(prompt, schema);

    return NextResponse.json({ concepts: result.concepts });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract concepts' }, { status: 500 });
  }
}
