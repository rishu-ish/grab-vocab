// app/api/subject/[subject]/route.ts
import { connectToDB } from "@/lib/mongodb";
import { getSubjectWords } from "@/lib/subject-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { subject: string } }
) {
  try {
    await connectToDB();

    const subject = params.subject;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const data = await getSubjectWords(subject, page, limit);

    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (err: any) {
    console.error("❌ API error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: err.message.includes("not found") ? 404 : 500 }
    );
  }
}