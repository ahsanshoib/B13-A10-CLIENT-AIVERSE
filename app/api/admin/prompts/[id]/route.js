import connectDB from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(request, context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { status, isFeatured, rejectionFeedback } = body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
    if (rejectionFeedback !== undefined) updateData.rejectionFeedback = rejectionFeedback;

    const prompt = await Prompt.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!prompt) {
      return Response.json({ success: false, error: "Prompt not found" }, { status: 404 });
    }

    return Response.json({ success: true, prompt });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const deleted = await Prompt.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ success: false, error: "Prompt not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Prompt deleted" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}