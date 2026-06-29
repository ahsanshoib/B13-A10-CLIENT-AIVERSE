import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("AiVerse");
    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.user.id),
    });
    await client.close();

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}