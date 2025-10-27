"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/global/DatePicker";
import { generateBolPdf } from "@/lib/pdf";

export default function BolForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [form, setForm] = useState({
    loadId: "",
    companyName: "",
    companyStreet: "",
    companyCityStateZip: "",
    mc: "",
    phone: "",
    email: "",
    datePickup: "",
    dateDelivery: "",
    pickupAddress: "",
    deliveryAddress: "",
    vinCode: "",
    model: "",
    type: "",
  });

  // Split address into street + city/state/zip
  function parseAddress(address: string) {
    const parts = address.split(",").map((p) => p.trim());
    const street = parts[0] || "";
    const cityStateZip = parts.slice(1).join(", ").trim();
    return { street, cityStateZip };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { street: pickupStreet, cityStateZip: pickupCityStateZip } =
      parseAddress(form.pickupAddress);
    const { street: deliveryStreet, cityStateZip: deliveryCityStateZip } =
      parseAddress(form.deliveryAddress);

    // Format date (MMM dd, yyyy)
    const formattedDate = selectedDate
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(selectedDate)
      : "";

    // Create formatted object for PDF
    const formattedForm = {
      ...form,
      mc: form.mc ? `MC Number: ${form.mc}` : "",
      phone: form.phone ? `Phone: ${form.phone}` : "",
      email: form.email ? `Email: ${form.email}` : "",
      pickupStreet,
      pickupCityStateZip,
      deliveryStreet,
      deliveryCityStateZip,
      datePickup: formattedDate,
      dateDelivery: formattedDate, // ✅ same date for both
    };

    // await generateBolPdf(formattedForm, selectedDate);
    try {
      // 🔥 Send to your API route
      const response = await fetch("/api/generate-bol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedForm),
      });

      if (!response.ok) {
        throw new Error("Failed to generate BOL PDF");
      }

      const data = await response.json();
      const { url } = data;

      // ✅ Option 1: open link (so user can view/download)
      window.open(url, "_blank");

      // ✅ Option 2 (optional): copy to clipboard
      // await navigator.clipboard.writeText(url);
      // alert("BOL link copied to clipboard!");

      // ✅ Option 3 (optional): send to Telegram (see below)
      // await sendToTelegram(driverChatId, url);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating the BOL.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>შეკვეთის დეტალები</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="loadId"
            placeholder="Load ID"
            value={form.loadId}
            onChange={handleChange}
          />
          <Input
            name="companyName"
            placeholder="სტიკერის კომპანია"
            value={form.companyName}
            onChange={handleChange}
          />
          <Input
            name="companyStreet"
            placeholder="კომპანიის ქუჩის მისამართი"
            value={form.companyStreet}
            onChange={handleChange}
          />
          <Input
            name="companyCityStateZip"
            placeholder="კომპანიის ქალაქი, შტატი, ზიპ კოდი"
            value={form.companyCityStateZip}
            onChange={handleChange}
          />
          <Input
            name="mc"
            placeholder="შეიყვანეთ MC"
            value={form.mc}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="შეიყვანეთ ტელეფონის ნომერი"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="შეიყვანეთ ემაილი"
            value={form.email}
            onChange={handleChange}
          />
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>მისამართები</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="pickupAddress"
            placeholder="Pickup მისამართი"
            value={form.pickupAddress}
            onChange={handleChange}
          />
          <Input
            name="deliveryAddress"
            placeholder="Delivery მისამართი"
            value={form.deliveryAddress}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card>
        <CardHeader>
          <CardTitle>მანქანის დეტალები</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            name="vinCode"
            placeholder="VIN კოდი"
            value={form.vinCode}
            onChange={handleChange}
          />
          <Input
            name="model"
            placeholder="Year/Model/Make"
            value={form.model}
            onChange={handleChange}
          />
          <Input
            name="type"
            placeholder="Sedan/Pickup..."
            value={form.type}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg"
      >
        PDF გენერირება
      </Button>
    </div>
  );
}
