import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { put } from "@vercel/blob";
import { format } from "date-fns";
import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { prisma } from "@/utils/db";

const inchToPt = (inches: number) => inches * 72;

type Coordinate = {
  x: number;
  yFromTop: number;
  fontSize?: number;
  size?: number;
  fontWeight?: "bold" | "normal";
};

const coordinatesInInches: Record<string, Coordinate> = {
  loadId: { x: 1.053, yFromTop: 2.478, fontSize: 11, fontWeight: "bold" },
  companyName: { x: 0.405, yFromTop: 0.828, fontSize: 16, fontWeight: "bold" },
  companyStreet: { x: 0.405, yFromTop: 1.049, size: 11 },
  companyCityStateZip: { x: 0.405, yFromTop: 1.239, size: 11 },
  mc: { x: 0.405, yFromTop: 1.427, size: 11 },
  phone: { x: 0.405, yFromTop: 1.617, size: 11 },
  email: { x: 0.405, yFromTop: 1.826, fontSize: 12 },
  pickupStreet: { x: 0.48, yFromTop: 3.21, fontSize: 9 },
  pickupCityStateZip: { x: 0.48, yFromTop: 3.381, fontSize: 9 },
  deliveryStreet: { x: 4.2, yFromTop: 3.21, fontSize: 9 },
  deliveryCityStateZip: { x: 4.2, yFromTop: 3.381, fontSize: 9 },
  vinCode: { x: 0.7, yFromTop: 4.23, fontSize: 9, fontWeight: "bold" },
  model: { x: 2.5, yFromTop: 4.23, fontSize: 10, fontWeight: "bold" },
  type: { x: 4.787, yFromTop: 4.23, fontSize: 10, fontWeight: "bold" },
  datePickup: { x: 1.5, yFromTop: 9.68, fontSize: 8 },
  dateDelivery: { x: 1.5, yFromTop: 10.405, fontSize: 8 },
};

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function sendTelegramMessage(
  chatId: string,
  url: string,
  loadId: string
) {
  try {
    const message = `🚛 ახალი ბიოელი\n\nLoad ID: ${loadId}\n\n📄 ბიოელის ჩამოტვირთვა:\n${url}`;

    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API error:", result);
    }

    return result;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "საჭიროა ავტორიზაცია" },
        { status: 401 }
      );
    }

    const form = await req.json();

    // 1️⃣ Load template from public folder
    const templatePath = path.join(process.cwd(), "public", "bol-parsed.pdf");
    const existingPdfBytes = await readFile(templatePath);

    console.log("Loaded PDF, size:", existingPdfBytes.length);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 2️⃣ Fonts
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.getPages()[0];
    const { height: pageHeight } = page.getSize();

    // 3️⃣ Fill data
    const mergedData = {
      ...form,
      date: format(new Date(), "MMM dd, yyyy"),
    };

    for (const [key, value] of Object.entries(mergedData)) {
      const coord =
        coordinatesInInches[key as keyof typeof coordinatesInInches];
      if (!coord) continue;
      const text = String(value ?? "").trim();
      if (!text) continue;
      const x = inchToPt(coord.x);
      const y = pageHeight - inchToPt(coord.yFromTop);
      const fontSize = coord.fontSize ?? coord.size ?? 12;
      const font = coord.fontWeight === "bold" ? fontBold : fontNormal;

      page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
    }

    // 4️⃣ Save PDF to buffer
    const pdfBytes = await pdfDoc.save();

    // 5️⃣ Upload to Vercel Blob (public)
    const currentDate = format(new Date(), "yyyy-MM-dd");
    const fileName = `bols/${form.loadId}-${currentDate}.pdf`;
    const buffer = Buffer.from(pdfBytes);
    const { url } = await put(fileName, buffer, {
      access: "public",
      contentType: "application/pdf",
    });

    // 6️⃣ Send URL to Telegram
    if (form.driverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: form.driverId },
        select: { telegramId: true },
      });

      if (driver?.telegramId) {
        await sendTelegramMessage(driver.telegramId, url, form.loadId);
        console.log(`PDF URL sent to driver via Telegram`);
      }
    }

    // 7️⃣ Return URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF-ის გენერირება ვერ მოხერხდა" },
      { status: 500 }
    );
  }
}
