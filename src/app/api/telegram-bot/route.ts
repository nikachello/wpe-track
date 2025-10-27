// pages/api/telegram.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/db";
import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const chatId = body.message?.chat?.id;
  const text = body.message?.text?.trim();

  if (!chatId || !text) return res.status(200).send("ok");

  // Try to find driver by chatId
  let driver = await prisma.driver.findUnique({
    where: { telegramId: chatId },
  });

  if (!driver) {
    // Ask for email first
    await prisma.driver.create({
      data: { telegramId: chatId, name: "", lastName: "" },
    });
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "გამარჯობა, გვთხოვთ მოგვწეროთ თქვენი მეილი:",
    });
    return res.status(200).send("ok");
  }

  // Check what info is missing
  if (!driver.email) {
    // Save email
    await prisma.driver.update({
      where: { telegramId: chatId },
      data: { email: text },
    });
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "მადლობა, ახლა მოგვწერეთ თქვენი სახელი და გვარი:",
    });
  } else if (driver.name === "" || driver.lastName == "") {
    // Parse first and last name from one message
    const parts = text.split(" ");
    if (parts.length < 2) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "გთხოვთ სახელს და გვარს შორის გამოტოვოთ ადგილი.",
      });
      return res.status(200).send("ok");
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
    // Driver already fully registered
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "თქვენ უკვე დარეგისტრირებული ხართ, დაელოდეთ ბიოელებს.",
    });
  }

  res.status(200).send("ok");
}
