import connectDB from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const users = await db.collection("user").find({}).sort({ createdAt: -1 }).toArray();
    await client.close();

    return Response.json({ success: true, users });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}