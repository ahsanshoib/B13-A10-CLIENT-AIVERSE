import connectDB from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request) {
  try {
    await connectDB();

    const mongoose = (await import('mongoose')).default;
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const count = await mongoose.connection.db.collection('prompts').countDocuments();
    console.log("Prompt count:", count);
    

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const aiTool = searchParams.get("aiTool") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const sort = searchParams.get("sort") || "latest";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const featured = searchParams.get("featured") || "";

    let query = {status:"approved"};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { aiTool: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (aiTool && aiTool !== "All") {
      query.aiTool = aiTool;
    }

    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    let sortOption = {};
    if (sort === "latest") sortOption = { createdAt: -1 };
    else if (sort === "popular") sortOption = { averageRating: -1 };
    else if (sort === "copied") sortOption = { copyCount: -1 };

    const skip = (page - 1) * limit;
    const total = await Prompt.countDocuments(query);
    const prompts = await Prompt.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return Response.json({
      success: true,
      prompts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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
    const body = await request.json();

    const userRole = session.user.role;
    if (userRole === "user") {
      const existingCount = await Prompt.countDocuments({
        creatorId: session.user.id,
      });
      if (existingCount >= 3) {
        return Response.json(
          { success: false, error: "Free users can only add 3 prompts" },
          { status: 403 }
        );
      }
    }

    const prompt = await Prompt.create({
      ...body,
      creatorId: session.user.id,
      creatorName: session.user.name,
      creatorEmail: session.user.email,
      status: "pending",
      copyCount: 0,
    });

    return Response.json({ success: true, prompt }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}