import {
  PDFDocument,
  StandardFonts,
  rgb
} from "pdf-lib";

import fs from "fs";
import path from "path";

const generatePaymentReceiptPDF = async (data: {
  customerName: string;
  customerEmail: string;
  receiptID: string;
  date: number;      
  paymentMethod: string;
  planName: string;
  credits: number;
  amount: number;
}) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 Size: 595 width, 842 height
    const { width, height } = page.getSize();

    // Load standard fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Margins and styling constants
    const margin = 54;
    const contentWidth = width - margin * 2;
    const primaryColor = rgb(0.03, 0.52, 0.52); // HireLoop brand teal
    const darkColor = rgb(0.06, 0.09, 0.16); // Slate/Navy dark text
    const mutedColor = rgb(0.4, 0.45, 0.5); // Gray muted text
    const lightGray = rgb(0.96, 0.97, 0.98); // Panel background
    const borderColor = rgb(0.88, 0.9, 0.94); // Border/divider gray

    // -------------------------------------------------------------------------
    // 1. Accent Bar at the top
    // -------------------------------------------------------------------------
    page.drawRectangle({
        x: 0,
        y: height - 8,
        width,
        height: 8,
        color: primaryColor,
    });

    // -------------------------------------------------------------------------
    // 2. Brand Header (Logo and Name)
    // -------------------------------------------------------------------------
    const logoPath = path.join(process.cwd(), "public", "logo_for_pdf.png");
    let logoWidth = 0;
    let logoHeight = 0;
    let hasLogo = false;
    let logo;

    try {
        if (fs.existsSync(logoPath)) {
            const logoBytes = fs.readFileSync(logoPath);
            logo = await pdfDoc.embedPng(logoBytes);
            hasLogo = true;
            // Scale logo to fit a max bounding box of 52x52
            const maxLogoSize = 52;
            const logoScale = Math.min(maxLogoSize / logo.width, maxLogoSize / logo.height);
            logoWidth = logo.width * logoScale;
            logoHeight = logo.height * logoScale;
        }
    } catch (e) {
        console.error("Could not load logo image", e);
    }

    let brandTextX = margin;
    if (hasLogo && logo) {
        const logoY = height - 54 - logoHeight;
        page.drawImage(logo, {
            x: margin,
            y: logoY,
            width: logoWidth,
            height: logoHeight,
        });
        brandTextX = margin + logoWidth + 12;
    }

    // Brand Name
    page.drawText("HireLoop", {
        x: brandTextX,
        y: height - 76,
        size: 20,
        font: bold,
        color: primaryColor,
    });

    // Brand Web Address
    page.drawText("hireloop.com", {
        x: brandTextX,
        y: height - 90,
        size: 9,
        font,
        color: mutedColor,
    });

    // -------------------------------------------------------------------------
    // 3. Receipt Metadata & Paid Badge (Right Side)
    // -------------------------------------------------------------------------
    const titleText = "PAYMENT RECEIPT";
    const titleTextWidth = bold.widthOfTextAtSize(titleText, 14);
    page.drawText(titleText, {
        x: width - margin - titleTextWidth,
        y: height - 68,
        size: 14,
        font: bold,
        color: darkColor,
    });

    // Green Paid Badge
    const badgeW = 54;
    const badgeH = 18;
    const badgeX = width - margin - badgeW;
    const badgeY = height - 92;

    page.drawRectangle({
        x: badgeX,
        y: badgeY,
        width: badgeW,
        height: badgeH,
        color: rgb(0.88, 0.95, 0.91), // Soft green background
    });

    const badgeText = "PAID";
    const badgeTextWidth = bold.widthOfTextAtSize(badgeText, 9);
    page.drawText(badgeText, {
        x: badgeX + (badgeW - badgeTextWidth) / 2,
        y: badgeY + (badgeH - 9) / 2 + 1,
        size: 9,
        font: bold,
        color: rgb(0.09, 0.48, 0.26), // Emerald green text
    });

    // Divider line below header
    const headerDividerY = height - 114;
    page.drawLine({
        start: { x: margin, y: headerDividerY },
        end: { x: width - margin, y: headerDividerY },
        thickness: 1,
        color: borderColor,
    });

    // -------------------------------------------------------------------------
    // 4. Billing Details & Receipt Metadata (Two Columns)
    // -------------------------------------------------------------------------
    let currentY = headerDividerY - 25;

    // Left Column: Customer Billing Info
    page.drawText("BILLED TO", {
        x: margin,
        y: currentY,
        size: 9,
        font: bold,
        color: mutedColor,
    });

    page.drawText(data.customerName, {
        x: margin,
        y: currentY - 16,
        size: 11,
        font: bold,
        color: darkColor,
    });

    page.drawText(data.customerEmail, {
        x: margin,
        y: currentY - 30,
        size: 9,
        font,
        color: mutedColor,
    });

    // Right Column: Details Grid
    const rightColX = width / 2 + 20;

    page.drawText("RECEIPT DETAILS", {
        x: rightColX,
        y: currentY,
        size: 9,
        font: bold,
        color: mutedColor,
    });

    const drawReceiptDetailRow = (label: string, val: string, rowY: number) => {
        page.drawText(label, {
            x: rightColX,
            y: rowY,
            size: 9,
            font,
            color: mutedColor,
        });
        page.drawText(val, {
            x: rightColX + 90,
            y: rowY,
            size: 9,
            font: bold,
            color: darkColor,
        });
    };

    // Construct receipt ID and formatted date (with time)

    const paymentDate = new Date(data.date * 1000);

    const formattedDate = paymentDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const formattedTime = paymentDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    const receiptDateTime = `${formattedDate}, ${formattedTime}`;

    drawReceiptDetailRow("Receipt No:", data.receiptID, currentY - 16);
    drawReceiptDetailRow("Date Paid:", receiptDateTime, currentY - 30);
    drawReceiptDetailRow("Payment Method:", data.paymentMethod, currentY - 44);

    // -------------------------------------------------------------------------
    // 5. Line Item Table
    // -------------------------------------------------------------------------
    currentY = currentY - 78;

    // Table Header Background
    const tableHeaderHeight = 22;
    page.drawRectangle({
        x: margin,
        y: currentY - tableHeaderHeight,
        width: contentWidth,
        height: tableHeaderHeight,
        color: lightGray,
    });

    // Table Headers
    const tableHeaderTextY = currentY - tableHeaderHeight + 7;
    page.drawText("PLAN", {
        x: margin + 12,
        y: tableHeaderTextY,
        size: 9,
        font: bold,
        color: mutedColor,
    });

    page.drawText("Credits Purchased", {
        x: margin + 240,
        y: tableHeaderTextY,
        size: 9,
        font: bold,
        color: mutedColor,
    });

    const headerAmountLabel = "AMOUNT";
    const headerAmountLabelW = bold.widthOfTextAtSize(headerAmountLabel, 9);
    page.drawText(headerAmountLabel, {
        x: width - margin - 12 - headerAmountLabelW,
        y: tableHeaderTextY,
        size: 9,
        font: bold,
        color: mutedColor,
    });

    // Table Divider Line
    page.drawLine({
        start: { x: margin, y: currentY - tableHeaderHeight },
        end: { x: width - margin, y: currentY - tableHeaderHeight },
        thickness: 1,
        color: borderColor,
    });

    // Table Row Content
    const rowY = currentY - tableHeaderHeight - 20;

    // Item Plan Name
    page.drawText(data.planName, {
        x: margin + 12,
        y: rowY,
        size: 10,
        font: bold,
        color: darkColor,
    });

    // Item Credits
    page.drawText(`${data.credits.toLocaleString()} Credits`, {
        x: margin + 240,
        y: rowY,
        size: 10,
        font,
        color: darkColor,
    });

    // Item Amount (Using INR to avoid WinAnsi encoding errors)
    const formattedAmount = `INR ${data.amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
    const amountWidth = bold.widthOfTextAtSize(formattedAmount, 10);
    page.drawText(formattedAmount, {
        x: width - margin - 12 - amountWidth,
        y: rowY,
        size: 10,
        font: bold,
        color: darkColor,
    });

    // Row Divider Line
    const tableDividerY = rowY - 26;
    page.drawLine({
        start: { x: margin, y: tableDividerY },
        end: { x: width - margin, y: tableDividerY },
        thickness: 1,
        color: borderColor,
    });

    // -------------------------------------------------------------------------
    // 6. Summary Totals (Right Side)
    // -------------------------------------------------------------------------
    let summaryY = tableDividerY - 20;

    const drawSummaryRow = (label: string, value: string, isTotal: boolean) => {
        const valueSize = isTotal ? 12 : 9.5;
        const valWidth = (isTotal ? bold : font).widthOfTextAtSize(value, valueSize);
        
        page.drawText(label, {
            x: width - margin - 180,
            y: summaryY,
            size: isTotal ? 11 : 9.5,
            font: isTotal ? bold : font,
            color: isTotal ? darkColor : mutedColor,
        });

        page.drawText(value, {
            x: width - margin - 12 - valWidth,
            y: summaryY,
            size: valueSize,
            font: isTotal ? bold : font,
            color: darkColor,
        });

        summaryY -= 18;
    };

    drawSummaryRow("Subtotal", formattedAmount, false);
    drawSummaryRow("Tax & Fees (0.00%)", "INR 0.00", false);
    
    // Short line for Grand Total header
    const totalLineY = summaryY + 10;
    page.drawLine({
        start: { x: width - margin - 180, y: totalLineY },
        end: { x: width - margin - 12, y: totalLineY },
        thickness: 1,
        color: borderColor,
    });

    summaryY -= 4; // Spacing adjustment
    drawSummaryRow("Total Paid", formattedAmount, true);

    // -------------------------------------------------------------------------
    // 7. Footer Contact & Note Box
    // -------------------------------------------------------------------------
    const footerBoxHeight = 45;
    const footerBoxY = 85;

    // Contact Shaded Panel
    page.drawRectangle({
        x: margin,
        y: footerBoxY,
        width: contentWidth,
        height: footerBoxHeight,
        color: lightGray,
    });

    // Border around panel
    page.drawRectangle({
        x: margin,
        y: footerBoxY,
        width: contentWidth,
        height: footerBoxHeight,
        borderColor,
        borderWidth: 1,
    });

    // Help Box Text
    page.drawText("Need help? support@hireloop.com*", {
        x: margin + 12,
        y: footerBoxY + 26,
        size: 9,
        font: bold,
        color: darkColor,
    });

    page.drawText("If you have any billing queries, feel free to reach out to us.", {
        x: margin + 12,
        y: footerBoxY + 12,
        size: 8,
        font,
        color: mutedColor,
    });

    // -------------------------------------------------------------------------
    // 8. Bottom Watermark & Developer Credit
    // -------------------------------------------------------------------------
    // Left Watermark (y = 52)
    page.drawText("Thank you for using HireLoop!", {
        x: margin,
        y: 52,
        size: 9,
        font: bold,
        color: primaryColor,
    });

    // Right Asterisk description (y = 52)
    const asteriskDisclaimer = "* This is a demo email address used for UI demonstration purposes only.";
    const asteriskW = font.widthOfTextAtSize(asteriskDisclaimer, 8);
    page.drawText(asteriskDisclaimer, {
        x: width - margin - asteriskW,
        y: 52,
        size: 8,
        font,
        color: rgb(0.6, 0.63, 0.68),
    });

    // Left Developer Credit (y = 36)
    page.drawText("Built with love by ", {
        x: margin,
        y: 36,
        size: 8.5,
        font,
        color: mutedColor,
    });
    const prefixW = font.widthOfTextAtSize("Built with love by ", 8.5);
    page.drawText("Ujjawal Gupta", {
        x: margin + prefixW,
        y: 36,
        size: 8.5,
        font: bold,
        color: darkColor,
    });

    // Right PDF Generated Notice (y = 36)
    const disclaimerText = "This receipt is automatically generated. No signature is required.";
    const disclaimerW = font.widthOfTextAtSize(disclaimerText, 8);
    page.drawText(disclaimerText, {
        x: width - margin - disclaimerW,
        y: 36,
        size: 8,
        font,
        color: rgb(0.6, 0.63, 0.68),
    });

    return await pdfDoc.save();
}

export default generatePaymentReceiptPDF;