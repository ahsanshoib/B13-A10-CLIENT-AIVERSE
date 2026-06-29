import connectDB from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import Review from "@/models/Review";
import Payment from "@/models/Payment";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const totalUsers = await db.collection("user").countDocuments();
    await client.close();

    const totalPrompts = await Prompt.countDocuments();
    const totalReviews = await Review.countDocuments();
    const payments = await Payment.find();
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const copyAggregation = await Prompt.aggregate([
      { $group: { _id: null, totalCopies: { $sum: "$copyCount" } } },
    ]);
    const totalCopies = copyAggregation[0]?.totalCopies || 0;

    // Engine distribution using aggregation
    const engineDistribution = await Prompt.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$aiTool",
          count: { $sum: 1 },
          totalCopies: { $sum: "$copyCount" },
        },
      },
    ]);

    return Response.json({
      success: true,
      analytics: {
        totalUsers,
        totalPrompts,
        totalReviews,
        totalCopies,
        totalRevenue,
        engineDistribution,
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}