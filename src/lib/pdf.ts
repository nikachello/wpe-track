import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { format } from "date-fns";

const inchToPt = (inches: number) => inches * 72;

type CoordinateConfig = {
  x: number;
  yFromTop: number;
  size?: number;
  bold?: boolean;
  fontSize?: number; // Alternative to 'size'
  fontWeight?: "normal" | "bold"; // Alternative to 'bold'
};

const coordinatesInInches: Record<string, CoordinateConfig> = {
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

export async function generateBolPdf(
  form: Record<string, any>,
  selectedDate?: Date
) {
  const response = await fetch("/bol-parsed.pdf");
  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed both font weights
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.getPages()[0];
  const { height: pageHeight } = page.getSize();

  const mergedData = {
    ...form,
    date: selectedDate ? format(selectedDate, "MMM dd, yyyy") : "",
  };

  for (const [key, value] of Object.entries(mergedData)) {
    const coord = coordinatesInInches[key];
    if (!coord) continue;

    const text = String(value ?? "").trim();
    if (!text) continue;

    const x = inchToPt(coord.x);
    const y = pageHeight - inchToPt(coord.yFromTop);

    // ✅ Support both old (bold/size) and new (fontWeight/fontSize) formats
    const isBold = coord.fontWeight === "bold" || coord.bold === true;
    const fontSize = coord.fontSize ?? coord.size ?? 12;
    const fontToUse = isBold ? fontBold : fontNormal;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font: fontToUse,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "filled-bol.pdf";
  link.click();
  URL.revokeObjectURL(url);
}
