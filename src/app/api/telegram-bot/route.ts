// src/app/api/telegram-bot/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: Request) {
  const body = await req.json();
  const chatId = String(body.message?.chat?.id);
  const text = body.message?.text?.trim();

  if (!chatId || !text) return NextResponse.json({ status: "ok" });

  const driver = await prisma.driver.findUnique({
    where: { telegramId: chatId },
  });

  if (!driver) {
    await prisma.driver.create({
      data: { telegramId: chatId, name: "", lastName: "" },
    });
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "გამარჯობა, გვთხოვთ მოგვწეროთ თქვენი მეილი:",
    });
    return NextResponse.json({ status: "ok" });
  }

  if (!driver.email) {
    await prisma.driver.update({
      where: { telegramId: chatId },
      data: { email: text },
    });
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "მადლობა, ახლა მოგვწერეთ თქვენი სახელი და გვარი:",
    });
  } else if (driver.name === "" || driver.lastName === "") {
    const parts = text.split(" ");
    if (parts.length < 2) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "გთხოვთ სახელს და გვარს შორის გამოტოვოთ ადგილი.",
      });
      return NextResponse.json({ status: "ok" });
    }

    await prisma.driver.update({
      where: { telegramId: chatId },
      data: { name: parts[0], lastName: parts.slice(1).join(" ") },
    });

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "მზადაა! ბიოელები გამოგეგზავნებათ აქ.",
    });
  } else {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "თქვენ უკვე დარეგისტრირებული ხართ, დაელოდეთ ბიოელებს.",
    });
  }

  return NextResponse.json({ status: "ok" });
}
