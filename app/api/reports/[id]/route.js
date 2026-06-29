import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import Prompt from "@/models/Prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

export async function PUT(request, context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const { action, status } = await request.json();

    const report = await Report.findById(id);
    if (!report) {
      return Response.json({ success: false, error: "Report not found" }, { status: 404 });
    }

    if (action === "remove") {
      
      await Prompt.findByIdAndDelete(report.promptId);
      
      await Report.findByIdAndDelete(id);
      return Response.json({ success: true, message: "Prompt removed and report deleted" });
    }

if (action === "warn") {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("AiVerse");

  const prompt = await Prompt.findById(report.promptId);
  if (prompt) {
    
    await db.collection("user").updateOne(
      { email: prompt.creatorEmail },
      {
        $push: {
          warnings: {
            promptId: report.promptId,
            promptTitle: report.promptTitle,
            reason: report.reason,
            warnedAt: new Date(),
          }
        },
        $inc: { warningCount: 1 }
      }
    );

    
    await Prompt.findByIdAndUpdate(report.promptId, {
      $set: { status: "warned" }
    });
  }

  await client.close();
  await Report.findByIdAndDelete(id);
  return Response.json({ success: true, message: "Creator warned and report dismissed" });
}

    if (status === "dismissed") {
      
      await Report.findByIdAndDelete(id);
      return Response.json({ success: true, message: "Report dismissed" });
    }

  
    const updated = await Report.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    return Response.json({ success: true, report: updated });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}