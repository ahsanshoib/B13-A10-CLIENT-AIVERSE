import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const bookmark = await Bookmark.findOne({
      promptId: params.promptId,
      userId: session.user.id,
    });

    return Response.json({ success: true, bookmarked: !!bookmark });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}