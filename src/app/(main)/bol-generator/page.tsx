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
  orderId: { x: 0.499 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 1.076 * 72 },
  companyName: { x: 0.499 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 1.838 * 72 },
  date: { x: 4.294 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 2.014 * 72 },
  pickupAddress: { x: 0.487 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 3.16 * 72 },
  deliveryAddress: { x: 4.366 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 3.16 * 72 },
  vinCode: { x: 1.41 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 4.897 * 72 },
  model: { x: 5.951 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 4.897 * 72 },
  make: { x: 6.7 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 4.897 * 72 },
  weight: { x: 7.338 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 4.897 * 72 },
  driverPrintedName: { x: 0.936 * 72, y: GLOBAL_PAGE_SIZE_POINTS - 8.327 * 72 },
  customerPrintedName: {
    x: 1.045 * 72,
    y: GLOBAL_PAGE_SIZE_POINTS - 8.497 * 72,
  },
};

const Page = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [form, setForm] = useState({
    orderId: "",
    companyName: "",
    date: "",
    pickupAddress: "",
    deliveryAddress: "",
    vinCode: "",
    model: "",
    make: "",
    weight: "",
    driverPrintedName: "",
    customerPrintedName: "",
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
          size: 8,
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
            name="orderId"
            placeholder="Order ID"
            value={form.orderId}
            onChange={handleChange}
          />
          <Input
            name="companyName"
            placeholder="სტიკერის კომპანია"
            value={form.companyName}
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
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
          />
          <Input
            name="make"
            placeholder="Make"
            value={form.make}
            onChange={handleChange}
          />
          <Input
            name="weight"
            placeholder="Weight (lbs) ან დატოვეთ ცარიელი"
            value={form.weight}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* People Info */}
      <Card>
        <CardHeader>
          <CardTitle>ხელმოწერები</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="driverPrintedName"
            placeholder="მძღოლის სახელი"
            value={form.driverPrintedName}
            onChange={handleChange}
          />
          <Input
            name="customerPrintedName"
            placeholder="მომხმარებლის სახელი"
            value={form.customerPrintedName}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

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
