import { NextResponse } from "next/server";
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
export async function POST(req: Request) {
  try {
    const { driverId, companyId } = await req.json();

    // Trigger Pusher event
    await pusher.trigger("drivers", "driverAssigned", {
      driverId,
      companyId,
    });

    return NextResponse.json({ message: "Event triggered" }, { status: 200 });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    return NextResponse.json({ error: "Failed to trigger event" }, { status: 500 });
  }
}
