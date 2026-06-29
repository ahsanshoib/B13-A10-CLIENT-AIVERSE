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

    const creatorId = session.user.id;

    const prompts = await Prompt.find({ creatorId });
    const totalPrompts = prompts.length;
    const totalCopies = prompts.reduce((sum, p) => sum + (p.copyCount || 0), 0);
    const totalBookmarks = prompts.reduce((sum, p) => sum + (p.bookmarkCount || 0), 0);

 const growthData = await Prompt.aggregate([
  {
    $match: {
      creatorId: creatorId,
    },
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m", date: "$createdAt" },
      },
      totalCopies: { $sum: "$copyCount" },
      totalBookmarks: { $sum: "$bookmarkCount" },
      totalPrompts: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);

    return Response.json({
      success: true,
      analytics: {
        totalPrompts,
        totalCopies,
        totalBookmarks,
        prompts,
        growthData,
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}