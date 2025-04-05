import clientPromise from "@/lib/mongodb";
import allowCors from "@/lib/cors";
 async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, message } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const userMessages = db.collection("user_chats");

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 1: Check if the message already exists
    const existingChat = await userMessages.findOne({ user_id: user._id });

    const existingMessage = existingChat?.messages?.find(
      (msg) => msg.text === message
    );

    if (existingMessage) {
      // Step 2: Update the timestamp of the existing message
      await userMessages.updateOne(
        { user_id: user._id, "messages.text": message },
        {
          $set: {
            "messages.$.timestamp": new Date(),
            updated_at: new Date(),
          },
        }
      );
    } else {
      // Step 3: Push new message
      await userMessages.updateOne(
        { user_id: user._id },
        {
          $push: {
            messages: {
              text: message,
              timestamp: new Date(),
            },
          },
          $set: {
            updated_at: new Date(),
          },
        },
        { upsert: true }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
export default allowCors(handler);