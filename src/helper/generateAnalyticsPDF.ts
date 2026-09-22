import { PDFDocument, StandardFonts, rgb, PDFFont, PDFImage } from "pdf-lib";
import fs from "fs";
import path from "path";
import { InterviewReportData, InterviewSessionInfo } from "@/src/components/analytics/analyticsTypes";
import { formatIdIntoLabel } from "@/src/helper/helper.common";
import { formatDuration, formatInterviewDate } from "@/src/components/history/historyHelpers";

// Color Palette Constants
const TEAL_PRIMARY = rgb(0.05, 0.58, 0.55); // #0d9488
const TEAL_LIGHT = rgb(0.91, 0.97, 0.97);
const TEAL_BORDER = rgb(0.75, 0.9, 0.88);
const DARK_SLATE = rgb(0.06, 0.09, 0.16); // #0f172a
const TEXT_MUTED = rgb(0.42, 0.46, 0.53);
const LIGHT_BG = rgb(0.96, 0.97, 0.99);
const BORDER_COLOR = rgb(0.88, 0.9, 0.94);
const WHITE = rgb(1, 1, 1);
const SUCCESS_GREEN = rgb(0.08, 0.62, 0.38);
const GREEN_BG = rgb(0.91, 0.97, 0.93);
const AMBER_ORANGE = rgb(0.85, 0.48, 0.08);
const AMBER_BG = rgb(0.99, 0.95, 0.89);
const BLUE_ACCENT = rgb(0.12, 0.44, 0.85);
const BLUE_BG = rgb(0.92, 0.95, 0.99);

/**
 * Sanitizes text to pure ASCII to prevent WinAnsi encoding errors in StandardFonts.Helvetica
 */
function sanitizeText(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2022\u00B7]/g, "*")
    .replace(/[\u2192\u21D2]/g, "->")
    .replace(/[\u2190\u21D0]/g, "<-")
    .replace(/\u20B9/g, "INR ")
    .replace(/[^\x20-\x7E\r\n\t]/g, " "); // Replace unprintable or non-ASCII characters with spaces
}

/**
 * Wraps text to fit within a given maxWidth
 */
function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const sanitized = sanitizeText(text);
  const paragraphs = sanitized.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (para.trim() === "") {
      lines.push("");
      continue;
    }
    const words = para.split(" ");
    let currentLine = "";

    for (const word of words) {
      if (!word) continue;
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        // Handle single word wider than maxWidth
        if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
          let chunk = "";
          for (const char of word) {
            if (font.widthOfTextAtSize(chunk + char, fontSize) <= maxWidth) {
              chunk += char;
            } else {
              lines.push(chunk);
              chunk = char;
            }
          }
          currentLine = chunk;
        } else {
          currentLine = word;
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export async function generateAnalyticsPDF(
  interviewDetails: InterviewSessionInfo,
  report: InterviewReportData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 42;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const BOTTOM_MARGIN = 55;

  let logoImage: PDFImage | undefined;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo_for_pdf.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    }
  } catch (err) {
    console.error("Could not embed logo for analytics PDF:", err);
  }

  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT;

  const roleLabel = formatIdIntoLabel(interviewDetails.role);
  const expLabel = formatIdIntoLabel(interviewDetails.experience);
  const typeLabel = formatIdIntoLabel(interviewDetails.type);
  const difficultyLabel = formatIdIntoLabel(interviewDetails.difficulty);

  const ensureSpace = (neededHeight: number) => {
    if (currentY - neededHeight < BOTTOM_MARGIN) {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      currentY = PAGE_HEIGHT - 45; // Start below running header on new page
    }
  };

  // ---------------------------------------------------------------------------
  // 1. TOP ACCENT BAR & COVER HEADER (Page 1)
  // ---------------------------------------------------------------------------
  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 6,
    width: PAGE_WIDTH,
    height: 6,
    color: TEAL_PRIMARY,
  });

  currentY = PAGE_HEIGHT - 28;

  // Embed Logo
  let logoEndX = MARGIN;
  if (logoImage) {
    const maxLogoDim = 46;
    const scale = Math.min(maxLogoDim / logoImage.width, maxLogoDim / logoImage.height);
    const logoW = logoImage.width * scale;
    const logoH = logoImage.height * scale;
    currentPage.drawImage(logoImage, {
      x: MARGIN,
      y: currentY - logoH + 6,
      width: logoW,
      height: logoH,
    });
    logoEndX = MARGIN + logoW + 12;
  }

  // Brand Name & Subtitle
  currentPage.drawText("HireLoop", {
    x: logoEndX,
    y: currentY - 10,
    size: 20,
    font: bold,
    color: DARK_SLATE,
  });

  currentPage.drawText("AI INTERVIEW PERFORMANCE REPORT", {
    x: logoEndX,
    y: currentY - 24,
    size: 8,
    font: bold,
    color: TEAL_PRIMARY,
  });

  currentPage.drawText("Built with love by Ujjawal Gupta", {
    x: logoEndX,
    y: currentY - 36,
    size: 8,
    font,
    color: TEXT_MUTED,
  });

  // Right Side Header Badge
  const reportBadgeText = "OFFICIAL EVALUATION";
  const badgeWidth = bold.widthOfTextAtSize(reportBadgeText, 8) + 16;
  const badgeHeight = 20;
  const badgeX = PAGE_WIDTH - MARGIN - badgeWidth;
  const badgeY = currentY - 14;

  currentPage.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeWidth,
    height: badgeHeight,
    color: TEAL_LIGHT,
    borderColor: TEAL_BORDER,
    borderWidth: 1,
  });

  currentPage.drawText(reportBadgeText, {
    x: badgeX + 8,
    y: badgeY + 6,
    size: 8,
    font: bold,
    color: TEAL_PRIMARY,
  });

  const generatedDateStr = `Report Date: ${formatInterviewDate(interviewDetails.createdAt)}`;
  const dateStrWidth = font.widthOfTextAtSize(generatedDateStr, 8);
  currentPage.drawText(generatedDateStr, {
    x: PAGE_WIDTH - MARGIN - dateStrWidth,
    y: badgeY - 14,
    size: 8,
    font,
    color: TEXT_MUTED,
  });

  currentY -= 54;

  // Divider
  currentPage.drawLine({
    start: { x: MARGIN, y: currentY },
    end: { x: PAGE_WIDTH - MARGIN, y: currentY },
    thickness: 1,
    color: BORDER_COLOR,
  });

  currentY -= 12;

  // ---------------------------------------------------------------------------
  // 1.5 CANDIDATE INFORMATION STRIP (Report Belongs To)
  // ---------------------------------------------------------------------------
  const candidateName = interviewDetails.userName || "Candidate";
  const candidateEmail = interviewDetails.userEmail || "";

  const candidateBoxHeight = 32;
  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - candidateBoxHeight,
    width: CONTENT_WIDTH,
    height: candidateBoxHeight,
    color: TEAL_LIGHT,
    borderColor: TEAL_BORDER,
    borderWidth: 1,
  });

  // Left: Candidate Name
  currentPage.drawText("REPORT GENERATED FOR:", {
    x: MARGIN + 12,
    y: currentY - 13,
    size: 7,
    font: bold,
    color: TEAL_PRIMARY,
  });

  currentPage.drawText(sanitizeText(candidateName), {
    x: MARGIN + 12,
    y: currentY - 25,
    size: 9.5,
    font: bold,
    color: DARK_SLATE,
  });

  // Right: Candidate Email
  if (candidateEmail) {
    const emailLabel = "ACCOUNT EMAIL:";
    const emailVal = sanitizeText(candidateEmail);
    const emailValW = font.widthOfTextAtSize(emailVal, 9);
    const emailLabelW = bold.widthOfTextAtSize(emailLabel, 7);
    const rightBlockW = Math.max(emailValW, emailLabelW);
    const rightX = PAGE_WIDTH - MARGIN - 14 - rightBlockW;

    currentPage.drawText(emailLabel, {
      x: rightX,
      y: currentY - 13,
      size: 7,
      font: bold,
      color: TEAL_PRIMARY,
    });

    currentPage.drawText(emailVal, {
      x: rightX,
      y: currentY - 25,
      size: 9,
      font,
      color: DARK_SLATE,
    });
  }

  currentY -= candidateBoxHeight + 12;

  // ---------------------------------------------------------------------------
  // 2. SESSION METADATA PANEL
  // ---------------------------------------------------------------------------
  const metaBoxHeight = 52;
  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - metaBoxHeight,
    width: CONTENT_WIDTH,
    height: metaBoxHeight,
    color: LIGHT_BG,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  const colWidth = CONTENT_WIDTH / 5;
  const metaItems = [
    { label: "TARGET ROLE", val: roleLabel },
    { label: "EXPERIENCE", val: expLabel },
    { label: "INTERVIEW TYPE", val: typeLabel },
    { label: "DIFFICULTY", val: difficultyLabel },
    {
      label: "COMPLETED",
      val: `${interviewDetails.answered} / ${interviewDetails.totalQuestions} (${formatDuration(
        interviewDetails.timeElapsed
      )})`,
    },
  ];

  metaItems.forEach((item, index) => {
    const itemX = MARGIN + index * colWidth + 10;
    const labelY = currentY - 18;
    const valY = currentY - 34;

    currentPage.drawText(item.label, {
      x: itemX,
      y: labelY,
      size: 7.5,
      font: bold,
      color: TEXT_MUTED,
    });

    const truncatedVal = item.val.length > 22 ? item.val.substring(0, 20) + "..." : item.val;
    currentPage.drawText(sanitizeText(truncatedVal), {
      x: itemX,
      y: valY,
      size: 9,
      font: bold,
      color: DARK_SLATE,
    });
  });

  currentY -= metaBoxHeight + 16;

  // ---------------------------------------------------------------------------
  // 3. EXECUTIVE SCORE CARDS (Overall Score & Communication Score)
  // ---------------------------------------------------------------------------
  ensureSpace(115);
  const cardWidth = (CONTENT_WIDTH - 12) / 2;
  const cardHeight = 96;

  // Card 1: Overall Interview Score
  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: WHITE,
    borderColor: TEAL_BORDER,
    borderWidth: 1.5,
  });

  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - 6,
    width: cardWidth,
    height: 6,
    color: TEAL_PRIMARY,
  });

  currentPage.drawText("OVERALL INTERVIEW SCORE", {
    x: MARGIN + 14,
    y: currentY - 24,
    size: 8.5,
    font: bold,
    color: TEXT_MUTED,
  });

  const overallScoreStr = `${report.overallScore}`;
  currentPage.drawText(overallScoreStr, {
    x: MARGIN + 14,
    y: currentY - 60,
    size: 32,
    font: bold,
    color: TEAL_PRIMARY,
  });

  currentPage.drawText("/ 100", {
    x: MARGIN + 14 + bold.widthOfTextAtSize(overallScoreStr, 32) + 4,
    y: currentY - 50,
    size: 11,
    font: bold,
    color: TEXT_MUTED,
  });

  // Rating Badge
  const ratingText = `Rating: ${report.performance.toUpperCase()}`;
  const ratingWidth = bold.widthOfTextAtSize(ratingText, 8) + 12;
  currentPage.drawRectangle({
    x: MARGIN + cardWidth - ratingWidth - 14,
    y: currentY - 56,
    width: ratingWidth,
    height: 18,
    color: TEAL_LIGHT,
  });
  currentPage.drawText(ratingText, {
    x: MARGIN + cardWidth - ratingWidth - 8,
    y: currentY - 50,
    size: 8,
    font: bold,
    color: TEAL_PRIMARY,
  });

  // Score Bar
  const barW = cardWidth - 28;
  const barH = 5;
  currentPage.drawRectangle({
    x: MARGIN + 14,
    y: currentY - 80,
    width: barW,
    height: barH,
    color: LIGHT_BG,
  });
  currentPage.drawRectangle({
    x: MARGIN + 14,
    y: currentY - 80,
    width: (barW * Math.min(100, Math.max(0, report.overallScore))) / 100,
    height: barH,
    color: TEAL_PRIMARY,
  });

  // Card 2: Communication Score
  const card2X = MARGIN + cardWidth + 12;
  currentPage.drawRectangle({
    x: card2X,
    y: currentY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: WHITE,
    borderColor: BORDER_COLOR,
    borderWidth: 1.5,
  });

  currentPage.drawRectangle({
    x: card2X,
    y: currentY - 6,
    width: cardWidth,
    height: 6,
    color: BLUE_ACCENT,
  });

  currentPage.drawText("COMMUNICATION DIAGNOSTICS", {
    x: card2X + 14,
    y: currentY - 24,
    size: 8.5,
    font: bold,
    color: TEXT_MUTED,
  });

  const commScoreStr = `${report.communicationScore}`;
  currentPage.drawText(commScoreStr, {
    x: card2X + 14,
    y: currentY - 60,
    size: 32,
    font: bold,
    color: BLUE_ACCENT,
  });

  currentPage.drawText("/ 100", {
    x: card2X + 14 + bold.widthOfTextAtSize(commScoreStr, 32) + 4,
    y: currentY - 50,
    size: 11,
    font: bold,
    color: TEXT_MUTED,
  });

  // Comm Rating Badge
  const commRatingText = `Rating: ${report.communicationPerformance.toUpperCase()}`;
  const commRatingWidth = bold.widthOfTextAtSize(commRatingText, 8) + 12;
  currentPage.drawRectangle({
    x: card2X + cardWidth - commRatingWidth - 14,
    y: currentY - 56,
    width: commRatingWidth,
    height: 18,
    color: BLUE_BG,
  });
  currentPage.drawText(commRatingText, {
    x: card2X + cardWidth - commRatingWidth - 8,
    y: currentY - 50,
    size: 8,
    font: bold,
    color: BLUE_ACCENT,
  });

  // Comm Score Bar
  currentPage.drawRectangle({
    x: card2X + 14,
    y: currentY - 80,
    width: barW,
    height: barH,
    color: LIGHT_BG,
  });
  currentPage.drawRectangle({
    x: card2X + 14,
    y: currentY - 80,
    width: (barW * Math.min(100, Math.max(0, report.communicationScore))) / 100,
    height: barH,
    color: BLUE_ACCENT,
  });

  currentY -= cardHeight + 16;

  // ---------------------------------------------------------------------------
  // 4. EXECUTIVE AI INTERVIEW SUMMARY
  // ---------------------------------------------------------------------------
  const summaryLines = wrapText(report.summary || "No summary provided.", CONTENT_WIDTH - 28, font, 9);
  const summaryBoxHeight = Math.max(54, summaryLines.length * 13 + 34);

  ensureSpace(summaryBoxHeight + 14);

  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - summaryBoxHeight,
    width: CONTENT_WIDTH,
    height: summaryBoxHeight,
    color: LIGHT_BG,
    borderColor: TEAL_BORDER,
    borderWidth: 1,
  });

  // Summary Header inside Box
  currentPage.drawText("EXECUTIVE AI EVALUATION SUMMARY", {
    x: MARGIN + 14,
    y: currentY - 18,
    size: 8.5,
    font: bold,
    color: TEAL_PRIMARY,
  });

  let textCursorY = currentY - 32;
  for (const line of summaryLines) {
    currentPage.drawText(line, {
      x: MARGIN + 14,
      y: textCursorY,
      size: 8.5,
      font,
      color: DARK_SLATE,
    });
    textCursorY -= 13;
  }

  currentY -= summaryBoxHeight + 16;

  // ---------------------------------------------------------------------------
  // 5. FIVE CORE PERFORMANCE PARAMETERS
  // ---------------------------------------------------------------------------
  ensureSpace(120);

  currentPage.drawText("OVERALL COMPETENCY BREAKDOWN", {
    x: MARGIN,
    y: currentY,
    size: 10,
    font: bold,
    color: DARK_SLATE,
  });

  currentY -= 14;

  const coreParams = [
    { label: "Confidence", score: report.confidenceScore},
    { label: "Clarity", score: report.clarityScore},
    { label: "Answer Relevancy", score: report.relevancyScore},
    { label: "Depth of Knowledge", score: report.depthScore},
    { label: "Problem Solving", score: report.problemSolvingScore},
  ];

  const paramBoxW = (CONTENT_WIDTH - 8) / 5;
  const paramBoxH = 52;

  coreParams.forEach((param, i) => {
    const pX = MARGIN + i * (paramBoxW + 2);
    currentPage.drawRectangle({
      x: pX,
      y: currentY - paramBoxH,
      width: paramBoxW,
      height: paramBoxH,
      color: WHITE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    });

    currentPage.drawText(param.label, {
      x: pX + 8,
      y: currentY - 16,
      size: 8,
      font: bold,
      color: DARK_SLATE,
    });

    currentPage.drawText(`${param.score}%`, {
      x: pX + 8,
      y: currentY - 34,
      size: 14,
      font: bold,
      color: TEAL_PRIMARY,
    });

    // Small progress bar
    const pBarW = paramBoxW - 16;
    currentPage.drawRectangle({
      x: pX + 8,
      y: currentY - 44,
      width: pBarW,
      height: 3.5,
      color: LIGHT_BG,
    });
    currentPage.drawRectangle({
      x: pX + 8,
      y: currentY - 44,
      width: (pBarW * Math.min(100, Math.max(0, param.score))) / 100,
      height: 3.5,
      color: TEAL_PRIMARY,
    });
  });

  currentY -= paramBoxH + 16;

  // ---------------------------------------------------------------------------
  // 6. STRENGTHS, WEAKNESSES & AI RECOMMENDATIONS (3 Columns)
  // ---------------------------------------------------------------------------
  ensureSpace(140);

  currentPage.drawText("DIAGNOSTIC INSIGHTS & ACTIONABLE RECOMMENDATIONS", {
    x: MARGIN,
    y: currentY,
    size: 10,
    font: bold,
    color: DARK_SLATE,
  });

  currentY -= 14;

  const col3Width = (CONTENT_WIDTH - 16) / 3;

  const renderInsightBox = (
    title: string,
    items: string[],
    boxX: number,
    accentColor: ReturnType<typeof rgb>,
    bgLight: ReturnType<typeof rgb>
  ) => {
    let totalTextHeight = 24;
    const wrappedItems: string[][] = [];

    items.forEach((item) => {
      const lines = wrapText(`- ${item}`, col3Width - 18, font, 7.5);
      wrappedItems.push(lines);
      totalTextHeight += lines.length * 11 + 5;
    });

    const boxHeight = Math.max(120, totalTextHeight);

    currentPage.drawRectangle({
      x: boxX,
      y: currentY - boxHeight,
      width: col3Width,
      height: boxHeight,
      color: bgLight,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    });

    currentPage.drawRectangle({
      x: boxX,
      y: currentY - 4,
      width: col3Width,
      height: 4,
      color: accentColor,
    });

    currentPage.drawText(title, {
      x: boxX + 10,
      y: currentY - 18,
      size: 8,
      font: bold,
      color: accentColor,
    });

    let yPos = currentY - 32;
    wrappedItems.forEach((lines) => {
      lines.forEach((line) => {
        currentPage.drawText(line, {
          x: boxX + 10,
          y: yPos,
          size: 7.5,
          font,
          color: DARK_SLATE,
        });
        yPos -= 11;
      });
      yPos -= 3;
    });

    return boxHeight;
  };

  const h1 = renderInsightBox("KEY STRENGTHS", report.strengths || [], MARGIN, SUCCESS_GREEN, GREEN_BG);
  const h2 = renderInsightBox(
    "AREAS FOR IMPROVEMENT",
    report.weaknesses || [],
    MARGIN + col3Width + 8,
    AMBER_ORANGE,
    AMBER_BG
  );
  const h3 = renderInsightBox(
    "AI RECOMMENDATIONS",
    report.recommendations || [],
    MARGIN + (col3Width + 8) * 2,
    TEAL_PRIMARY,
    TEAL_LIGHT
  );

  const maxInsightHeight = Math.max(h1, h2, h3);
  currentY -= maxInsightHeight + 18;

  // ---------------------------------------------------------------------------
  // 7. COMMUNICATION METRICS & FEEDBACK
  // ---------------------------------------------------------------------------
  ensureSpace(120);

  currentPage.drawText("COMMUNICATION PERFORMANCE DIAGNOSTICS", {
    x: MARGIN,
    y: currentY,
    size: 10,
    font: bold,
    color: DARK_SLATE,
  });

  currentY -= 14;

  const commParams = [
    { label: "Clarity", score: report.commClarityScore },
    { label: "Grammar & Lang", score: report.commGrammarScore },
    { label: "Vocabulary", score: report.commVocabularyScore },
    { label: "Tone & Warmth", score: report.commToneScore },
    { label: "Professionalism", score: report.commProfessionalismScore },
  ];

  const commBoxW = (CONTENT_WIDTH - 8) / 5;
  const commBoxH = 44;

  commParams.forEach((cp, idx) => {
    const cpX = MARGIN + idx * (commBoxW + 2);
    currentPage.drawRectangle({
      x: cpX,
      y: currentY - commBoxH,
      width: commBoxW,
      height: commBoxH,
      color: WHITE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    });

    currentPage.drawText(cp.label, {
      x: cpX + 8,
      y: currentY - 14,
      size: 7.5,
      font: bold,
      color: DARK_SLATE,
    });

    currentPage.drawText(`${cp.score}%`, {
      x: cpX + 8,
      y: currentY - 30,
      size: 11,
      font: bold,
      color: BLUE_ACCENT,
    });

    const w = commBoxW - 16;
    currentPage.drawRectangle({
      x: cpX + 8,
      y: currentY - 38,
      width: w,
      height: 3,
      color: LIGHT_BG,
    });
    currentPage.drawRectangle({
      x: cpX + 8,
      y: currentY - 38,
      width: (w * Math.min(100, Math.max(0, cp.score))) / 100,
      height: 3,
      color: BLUE_ACCENT,
    });
  });

  currentY -= commBoxH + 12;

  // Communication Feedback Card
  if (report.communicationFeedback) {
    const commLines = wrapText(report.communicationFeedback, CONTENT_WIDTH - 24, font, 8);
    const commBoxHeight = commLines.length * 12 + 26;

    ensureSpace(commBoxHeight + 10);

    currentPage.drawRectangle({
      x: MARGIN,
      y: currentY - commBoxHeight,
      width: CONTENT_WIDTH,
      height: commBoxHeight,
      color: BLUE_BG,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    });

    currentPage.drawText("VERBAL & LINGUISTIC FEEDBACK", {
      x: MARGIN + 12,
      y: currentY - 15,
      size: 8,
      font: bold,
      color: BLUE_ACCENT,
    });

    let cy = currentY - 28;
    commLines.forEach((cline) => {
      currentPage.drawText(cline, {
        x: MARGIN + 12,
        y: cy,
        size: 8,
        font,
        color: DARK_SLATE,
      });
      cy -= 12;
    });

    currentY -= commBoxHeight + 18;
  }

  // ---------------------------------------------------------------------------
  // 8. QUESTION-BY-QUESTION EVALUATION BREAKDOWN
  // ---------------------------------------------------------------------------
  if (report.questionAnalyses && report.questionAnalyses.length > 0) {
    ensureSpace(80);

    currentPage.drawText("QUESTION-BY-QUESTION COMPREHENSIVE BREAKDOWN", {
      x: MARGIN,
      y: currentY,
      size: 10,
      font: bold,
      color: DARK_SLATE,
    });

    currentY -= 14;

    report.questionAnalyses.forEach((q, index) => {
      const qNumber = q.questionNumber ?? index + 1;
      const qScore = q.score ?? 0;

      const qTextLines = wrapText(`Q${qNumber}: ${q.question}`, CONTENT_WIDTH - 70, bold, 8.5);
      const answerLines = wrapText(`Candidate Answer: ${q.answer || "No response recorded."}`, CONTENT_WIDTH - 24, font, 8);
      const feedbackLines = wrapText(`AI Feedback: ${q.feedback || "Good response."}`, CONTENT_WIDTH - 24, font, 8);

      const qCardHeight =
        qTextLines.length * 12 +
        answerLines.length * 11 +
        feedbackLines.length * 11 +
        38;

      ensureSpace(qCardHeight + 10);

      // Card Box
      currentPage.drawRectangle({
        x: MARGIN,
        y: currentY - qCardHeight,
        width: CONTENT_WIDTH,
        height: qCardHeight,
        color: WHITE,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
      });

      // Left Accent Strip
      currentPage.drawRectangle({
        x: MARGIN,
        y: currentY - qCardHeight,
        width: 4,
        height: qCardHeight,
        color: qScore >= 7 ? SUCCESS_GREEN : qScore >= 5 ? AMBER_ORANGE : TEAL_PRIMARY,
      });

      // Score Pill on Right
      const scoreBadgeText = `Score: ${qScore}/10`;
      const scoreBadgeW = bold.widthOfTextAtSize(scoreBadgeText, 8) + 12;
      const scoreBadgeX = MARGIN + CONTENT_WIDTH - scoreBadgeW - 10;
      const scoreBadgeY = currentY - 20;

      currentPage.drawRectangle({
        x: scoreBadgeX,
        y: scoreBadgeY,
        width: scoreBadgeW,
        height: 16,
        color: qScore >= 7 ? GREEN_BG : qScore >= 5 ? AMBER_BG : TEAL_LIGHT,
      });

      currentPage.drawText(scoreBadgeText, {
        x: scoreBadgeX + 6,
        y: scoreBadgeY + 4,
        size: 8,
        font: bold,
        color: qScore >= 7 ? SUCCESS_GREEN : qScore >= 5 ? AMBER_ORANGE : TEAL_PRIMARY,
      });

      // Draw Question Lines
      let textY = currentY - 16;
      qTextLines.forEach((qLine) => {
        currentPage.drawText(qLine, {
          x: MARGIN + 12,
          y: textY,
          size: 8.5,
          font: bold,
          color: DARK_SLATE,
        });
        textY -= 12;
      });

      textY -= 4;

      // Draw Candidate Answer Lines
      answerLines.forEach((aLine) => {
        currentPage.drawText(aLine, {
          x: MARGIN + 12,
          y: textY,
          size: 7.5,
          font,
          color: TEXT_MUTED,
        });
        textY -= 11;
      });

      textY -= 3;

      // Draw AI Feedback Lines
      feedbackLines.forEach((fLine) => {
        currentPage.drawText(fLine, {
          x: MARGIN + 12,
          y: textY,
          size: 7.5,
          font,
          color: TEAL_PRIMARY,
        });
        textY -= 11;
      });

      currentY -= qCardHeight + 10;
    });
  }

  // ---------------------------------------------------------------------------
  // 9. THANK YOU NOTE (Closing note on last page)
  // ---------------------------------------------------------------------------
  const thankYouBoxHeight = 36;
  ensureSpace(thankYouBoxHeight + 20);

  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - thankYouBoxHeight,
    width: CONTENT_WIDTH,
    height: thankYouBoxHeight,
    color: TEAL_LIGHT,
    borderColor: TEAL_BORDER,
    borderWidth: 1.5,
  });

  currentPage.drawRectangle({
    x: MARGIN,
    y: currentY - 4,
    width: CONTENT_WIDTH,
    height: 4,
    color: TEAL_PRIMARY,
  });

  const thankYouTitle = "Thank you for using HireLoop!";
  currentPage.drawText(thankYouTitle, {
    x: MARGIN + 14,
    y: currentY - 19,
    size: 10,
    font: bold,
    color: TEAL_PRIMARY,
  });

  const thankYouSub = "We wish you great success in your upcoming interviews! Practice regularly to master your skills at hireloop.com";
  currentPage.drawText(thankYouSub, {
    x: MARGIN + 14,
    y: currentY - 30,
    size: 7.5,
    font,
    color: DARK_SLATE,
  });

  currentY -= thankYouBoxHeight + 14;

  // ---------------------------------------------------------------------------
  // 10. MULTI-PAGE RUNNING HEADERS & FOOTERS (Apply to all generated pages)
  // ---------------------------------------------------------------------------
  const totalPages = pdfDoc.getPageCount();

  pdfDoc.getPages().forEach((page, pageIdx) => {
    const pageNum = pageIdx + 1;

    // Running Header for pages > 1
    if (pageNum > 1) {
      page.drawRectangle({
        x: 0,
        y: PAGE_HEIGHT - 4,
        width: PAGE_WIDTH,
        height: 4,
        color: TEAL_PRIMARY,
      });

      page.drawText(`HireLoop - AI Interview Analytics Report | Candidate: ${sanitizeText(candidateName)}`, {
        x: MARGIN,
        y: PAGE_HEIGHT - 22,
        size: 8,
        font: bold,
        color: TEAL_PRIMARY,
      });

      const headerMeta = `${roleLabel} (${expLabel})`;
      const metaWidth = font.widthOfTextAtSize(headerMeta, 8);
      page.drawText(headerMeta, {
        x: PAGE_WIDTH - MARGIN - metaWidth,
        y: PAGE_HEIGHT - 22,
        size: 8,
        font,
        color: TEXT_MUTED,
      });

      page.drawLine({
        start: { x: MARGIN, y: PAGE_HEIGHT - 30 },
        end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 30 },
        thickness: 0.75,
        color: BORDER_COLOR,
      });
    }

    // Running Footer on ALL pages
    page.drawLine({
      start: { x: MARGIN, y: 38 },
      end: { x: PAGE_WIDTH - MARGIN, y: 38 },
      thickness: 0.75,
      color: BORDER_COLOR,
    });

    const footerBrandText = "HireLoop · Built with love by Ujjawal Gupta · AI Interview Report";
    page.drawText(footerBrandText, {
      x: MARGIN,
      y: 24,
      size: 7.5,
      font,
      color: TEXT_MUTED,
    });

    const pageCountText = `Page ${pageNum} of ${totalPages}`;
    const pageCountWidth = font.widthOfTextAtSize(pageCountText, 7.5);
    page.drawText(pageCountText, {
      x: PAGE_WIDTH - MARGIN - pageCountWidth,
      y: 24,
      size: 7.5,
      font: bold,
      color: TEAL_PRIMARY,
    });
  });

  return await pdfDoc.save();
}

export default generateAnalyticsPDF;
