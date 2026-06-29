import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Prompt from "@/models/Prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get("promptId");
    const userId = searchParams.get("userId");

    let query = {};
    if (promptId) query.promptId = promptId;
    if (userId) query.userId = userId;

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return Response.json({ success: true, reviews });
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
    const { promptId, rating, comment } = await request.json();

    const existing = await Review.findOne({
      promptId,
      userId: session.user.id,
    });

    if (existing) {
      return Response.json(
        { success: false, error: "You have already reviewed this prompt" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      promptId,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      rating,
      comment,
    });

    const reviews = await Review.find({ promptId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Prompt.findByIdAndUpdate(promptId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    return Response.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}