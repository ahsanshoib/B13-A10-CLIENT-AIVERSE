import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const reports = await Report.find().sort({ createdAt: -1 });
    return Response.json({ success: true, reports });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { promptId, promptTitle, reason, description } = await request.json();

    const report = await Report.create({
      promptId,
      promptTitle,
      reportedBy: session.user.name,
      reporterEmail: session.user.email,
      reason,
      description,
    });

    return Response.json({ success: true, report }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}