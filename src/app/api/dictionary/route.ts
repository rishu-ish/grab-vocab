import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Word from "@/models/Word";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;
    const query = search ? { word: { $regex: new RegExp(search, "i") } } : {};

    const [wordDocs, total] = await Promise.all([
      Word.find(query, {
        word: 1,
        meaning: 1,
        imageURL: 1,
        exampleSentence: 1,
        positivePrompt: 1,
        promptId: 1,
        _id: 0,
      })
        .skip(skip)
        .limit(limit)
        .sort({ word: 1 }),

      Word.countDocuments(query),
    ]);

    return NextResponse.json({
      wordsArray: wordDocs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("❌ Error in words:", err.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
