"use client";

import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { DatePicker } from "@/components/global/DatePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const GLOBAL_PAGE_SIZE_POINTS = 11 * 72;

const coordinates = {
  companyName: { x: 1.222 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 1.115 * 72 },
  dot: { x: 0.986 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 1.67 * 72 },
  mc: { x: 0.821 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 2.01 * 72 },
  date: { x: 4.416 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 6.15 * 72 },
  pickupAddress: { x: 0.389 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 7.65 * 72 },
  deliveryAddress: { x: 4.432 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 7.65 * 72 },
  vinCode: { x: 0.375 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 3.551 * 72 },
  model: { x: 2.613 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 3.551 * 72 },
};

const Page = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [form, setForm] = useState({
    companyName: "",
    dot: "",
    mc: "",
    date: "",
    pickupAddress: "",
    deliveryAddress: "",
    vinCode: "",
    model: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generatePdf = async () => {
    const response = await fetch("/bol.pdf");
    const existingPdfBytes = await response.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const dateText = selectedDate ? format(selectedDate, "MMM dd, yyyy") : "";

    const mergedData = {
      ...form,
      date: dateText,
    };

    Object.entries(mergedData).forEach(([key, value]) => {
      if (coordinates[key as keyof typeof coordinates]) {
        firstPage.drawText(value, {
          x: coordinates[key as keyof typeof coordinates].x,
          y: coordinates[key as keyof typeof coordinates].y,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filled-bol.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">BOL გენერატორი</h1>

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>შეკვეთის დეტალები</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="companyName"
            placeholder="სტიკერის კომპანია"
            value={form.companyName}
            onChange={handleChange}
          />
          <Input
            name="dot"
            placeholder="სტიკერის DOT"
            value={form.dot}
            onChange={handleChange}
          />
          <Input
            name="mc"
            placeholder="სტიკერის MC"
            value={form.mc}
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
        </CardContent>
      </Card>

      {/* People Info */}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          onClick={generatePdf}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg"
        >
          PDF გენერირება
        </Button>
      </div>
    </div>
  );
};

export default Page;
