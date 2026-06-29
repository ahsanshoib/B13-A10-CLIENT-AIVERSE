import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

export async function PUT(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name, photoURL } = await request.json();

    if (!name?.trim()) {
      return Response.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("AiVerse");

    const updateData = {
      name: name.trim(),
      updatedAt: new Date(),
    };

    if (photoURL) {
      updateData.image = photoURL;
      updateData.photoURL = photoURL;
    }

    await db.collection("user").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );
    await client.close();

    return Response.json({ success: true, message: "Profile updated" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}