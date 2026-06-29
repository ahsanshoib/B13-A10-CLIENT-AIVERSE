import connectDB from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request, context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const prompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    return Response.json({ success: true, copyCount: prompt.copyCount });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}