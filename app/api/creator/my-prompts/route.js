import connectDB from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const prompts = await Prompt.find({ creatorId: session.user.id }).sort({ createdAt: -1 });
    return Response.json({ success: true, prompts });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}