import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    
    if (role === "admin") {
      return Response.json({ success: false, error: "Cannot set admin role" }, { status: 403 });
    }

    if (!["user", "creator"].includes(role)) {
      return Response.json({ success: false, error: "Invalid role" }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("AiVerse");
    await db.collection("user").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { role } }
    );
    await client.close();

    return Response.json({ success: true, message: "Role updated" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}