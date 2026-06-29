import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
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
    const bookmarks = await Bookmark.find({ userId: session.user.id });
    const promptIds = bookmarks.map((b) => b.promptId);
    const prompts = await Prompt.find({ _id: { $in: promptIds } });

    return Response.json({ success: true, prompts, bookmarks });
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
    const { promptId } = await request.json();

    const existing = await Bookmark.findOne({
      promptId,
      userId: session.user.id,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      await Prompt.findByIdAndUpdate(promptId, { $inc: { bookmarkCount: -1 } });
      return Response.json({ success: true, bookmarked: false, message: "Bookmark removed" });
    }

    await Bookmark.create({ promptId, userId: session.user.id });
    await Prompt.findByIdAndUpdate(promptId, { $inc: { bookmarkCount: 1 } });
    return Response.json({ success: true, bookmarked: true, message: "Prompt bookmarked" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}