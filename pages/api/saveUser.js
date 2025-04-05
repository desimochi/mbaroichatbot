// pages/api/save-user.js
import clientPromise from "@/lib/mongodb";
import allowCors from "@/lib/cors";
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mbaroichat"); // replace with your DB name
    const users = db.collection("users");

    // Check for existing user by email or mobile
    const existingUser = await users.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists", user: existingUser });
    }

    // Insert new user
    const newUser = {
      name,
      email,
      mobile,
      created: new Date(),
    };

    const result = await users.insertOne(newUser);

    return res.status(201).json({ message: "User saved", user: result.ops?.[0] || newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export default allowCors(handler);