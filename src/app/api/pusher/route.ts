import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

// Initialize Pusher
const pusher = new Pusher({
  appId: "1946015",
  key: "9865990faeec082b3f3f",
  secret: "8b8fd3a737206f5cf8b8",
  cluster: "eu",
  useTLS: true,
});

// API Route Handler
export async function POST(req: NextApiRequest) {
  if (req.method === "POST") {
    const { driverId, companyId } = req.body;

    try {
      // Trigger Pusher event
      await pusher.trigger("drivers", "driverAssigned", {
        driverId,
        companyId,
      });
      return new Response("Event triggered", { status: 200 });
    } catch (error) {
      console.log("Error triggering Pusher event:", error);
      if (error instanceof Error) {
        console.log(error.message);
        return new Response(`Error: ${error.message}`, { status: 400 });
      }
    }
  }

  // Handle unsupported HTTP methods
  return new Response("Method not allowed", { status: 405 });
}
