import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const prompt = `
Generate a JSON array of 5 multiple-choice vocabulary quiz questions. Each object must follow this exact format:

{
  "word": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "explanation": "string"
}

Use real, uncommon English words. Only return the array. Format must be strict JSON, no extra text.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content ?? "";

    const questions = JSON.parse(content);

    return NextResponse.json({ success: true, data: questions });
  } catch (err: any) {
    console.error("❌ Quiz API Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
