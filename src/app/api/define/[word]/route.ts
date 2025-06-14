import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Word from "@/models/Word";
import { getWordDetails } from "@/lib/word-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    await connectToDB();
    const term = params.word.toLowerCase();

    const existing = await Word.findOne({ word: term });

    if (existing) {
      return NextResponse.json({ term, result: existing });
    }

    const wordData = await getWordDetails(term);
    const savedWord = await Word.create(wordData);

    return NextResponse.json({ term, result: savedWord });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
