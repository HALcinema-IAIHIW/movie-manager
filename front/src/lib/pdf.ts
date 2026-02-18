import { PDFDocument, PDFPage, PDFFont, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export type SeatTicketPdf = {
  seatId?: string | number;
  seatIdStr?: string;
  ticketTypeName?: string;
  price?: number;
};

export type PdfSourceData = {
  screen: string;
  movieTitle: string;
  date: string;
  time: string;
  seatTickets: SeatTicketPdf[];
  totalPrice?: number;
};

const A4_SIZE: [number, number] = [595.28, 841.89];
const MARGIN_X = 48;
const VALUE_GAP = 16;
const LINE_GAP = 18;
const mmToPt = (mm: number) => (mm * 72) / 25.4;

const safeText = (value: string) => (value && value.trim().length > 0 ? value : "-");

const formatScreening = (date: string, time: string) => {
  const timeText = time ? `${time}~` : "";
  return [date, timeText].filter(Boolean).join(" ");
};

const formatTotal = (totalPrice?: number) => {
  if (typeof totalPrice !== "number" || !Number.isFinite(totalPrice)) {
    return "-";
  }
  return `${totalPrice.toLocaleString()} 円`;
};

const formatIssuedAt = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const formatSeats = (tickets: SeatTicketPdf[]) => {
  const seats = tickets
    .map((ticket) => {
      const seat = ticket.seatIdStr ?? ticket.seatId ?? "";
      const seatText = String(seat).trim();
      const typeText = ticket.ticketTypeName ? `(${ticket.ticketTypeName})` : "";
      return [seatText, typeText].filter(Boolean).join(" ");
    })
    .filter((text) => text.length > 0);

  return seats.length > 0 ? seats : ["-"];
};

const wrapText = (
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
) => {
  if (!text) {
    return ["-"];
  }

  const chars = Array.from(text);
  const lines: string[] = [];
  let current = "";

  for (const char of chars) {
    const next = current + char;
    if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
      current = next;
    } else {
      if (current.length === 0) {
        lines.push(next);
        current = "";
      } else {
        lines.push(current);
        current = char;
      }
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : ["-"];
};

const drawLabelValue = (
  page: PDFPage,
  font: PDFFont,
  label: string,
  value: string,
  y: number,
  valueX: number,
  maxValueWidth: number,
  fontSize = 12
) => {
  page.drawText(label, {
    x: MARGIN_X,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const lines = wrapText(value, maxValueWidth, font, fontSize);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: valueX,
      y: y - LINE_GAP * index,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return y - LINE_GAP * lines.length;
};

const drawMultiValues = (
  page: PDFPage,
  font: PDFFont,
  label: string,
  values: string[],
  y: number,
  valueX: number,
  maxValueWidth: number,
  fontSize = 12
) => {
  const lines = values.length > 0 ? values : ["-"];

  page.drawText(label, {
    x: MARGIN_X,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const wrapped: string[] = [];
  lines.forEach((line) => {
    wrapped.push(...wrapText(line, maxValueWidth, font, fontSize));
  });

  wrapped.forEach((line, index) => {
    const lineY = y - LINE_GAP * index;
    page.drawText(line, {
      x: valueX,
      y: lineY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return y - LINE_GAP * wrapped.length;
};

const loadFont = async (pdfDoc: PDFDocument) => {
  const response = await fetch("/fonts/NotoSansJP-Regular.ttf");
  if (!response.ok) {
    throw new Error("フォントの読み込みに失敗しました");
  }
  const fontBytes = await response.arrayBuffer();
  return pdfDoc.embedFont(fontBytes, { subset: false });
};

const drawBackground = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
  width: number,
  height: number,
  imagePath: string,
  opacity: number
) => {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) {
      return;
    }
    const imageBytes = await response.arrayBuffer();
    const image = await pdfDoc.embedPng(imageBytes);

    const scale = Math.max(width / image.width, height / image.height);
    const imageWidth = image.width * scale;
    const imageHeight = image.height * scale;

    page.drawImage(image, {
      x: (width - imageWidth) / 2,
      y: (height - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight,
      opacity,
    });
  } catch (error) {
    console.warn("背景画像の読み込みに失敗:", error);
  }
};

const buildSimplePdf = async (
  data: PdfSourceData,
  title: string,
  includeTotal: boolean
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit as any);
  const font = await loadFont(pdfDoc);

  const page = pdfDoc.addPage(A4_SIZE);
  const { width, height } = page.getSize();

  const titleSize = 20;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  const labelFontSize = 12;
  const labels = ["スクリーン", "作品名", "日時", "座席", "合計金額"];
  const labelWidth = Math.max(
    ...labels.map((label) => font.widthOfTextAtSize(label, labelFontSize))
  );
  const valueX = MARGIN_X + labelWidth + VALUE_GAP;
  const maxValueWidth = width - valueX - MARGIN_X;
  let y = height - 64;

  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y,
    size: titleSize,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 32;

  y = drawLabelValue(
    page,
    font,
    "スクリーン",
    safeText(data.screen),
    y,
    valueX,
    maxValueWidth,
    labelFontSize
  );
  y = drawLabelValue(
    page,
    font,
    "作品名",
    safeText(data.movieTitle),
    y,
    valueX,
    maxValueWidth,
    labelFontSize
  );
  y = drawLabelValue(
    page,
    font,
    "日時",
    safeText(formatScreening(data.date, data.time)),
    y,
    valueX,
    maxValueWidth,
    labelFontSize
  );
  y = drawMultiValues(
    page,
    font,
    "座席",
    formatSeats(data.seatTickets),
    y,
    valueX,
    maxValueWidth,
    labelFontSize
  );

  if (includeTotal) {
    y = drawLabelValue(
      page,
      font,
      "合計金額",
      formatTotal(data.totalPrice),
      y,
      valueX,
      maxValueWidth,
      labelFontSize
    );
  }

  return pdfDoc.save();
};

const buildReceiptLayout = async (data: PdfSourceData): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit as any);
  const font = await loadFont(pdfDoc);

  const theaterName = "HAL CINEMA";
  const title = "領収書";
  const issuedAtText = `発行日(購入日時): ${formatIssuedAt(new Date())}`;

  const receiptWidth = mmToPt(148);
  const marginX = 16;
  const valueGap = 18;
  const lineGap = 14;
  const rowGap = 6;
  const topPadding = 20;
  const bottomPadding = 20;
  const headerSize = 10;
  const titleSize = 14;
  const issuedSize = 8;

  const rows: { label: string; value: string }[] = [
    { label: "スクリーン", value: safeText(data.screen) },
    { label: "作品名", value: safeText(data.movieTitle) },
    { label: "日時", value: safeText(formatScreening(data.date, data.time)) },
    { label: "座席", value: formatSeats(data.seatTickets).join(" / ") },
  ];

  const labelWidth = Math.max(
    ...rows.map((row) => font.widthOfTextAtSize(row.label, headerSize))
  );
  const colValueX = marginX + labelWidth + valueGap;
  const maxValueWidth = Math.max(40, receiptWidth - colValueX - marginX);

  const wrappedRows = rows.map((row) =>
    wrapText(row.value, maxValueWidth, font, headerSize)
  );
  const rowsHeight = wrappedRows.reduce(
    (sum, lines) => sum + lines.length * lineGap + rowGap,
    0
  );

  const headerBlockHeight = 40;
  const nameBlockHeight = 40;
  const tableHeaderHeight = 20;
  const totalBlockHeight = 24;

  const receiptHeight =
    topPadding +
    headerBlockHeight +
    nameBlockHeight +
    tableHeaderHeight +
    rowsHeight +
    totalBlockHeight +
    bottomPadding;

  const page = pdfDoc.addPage([receiptWidth, receiptHeight]);
  const { width, height } = page.getSize();

  await drawBackground(
    pdfDoc,
    page,
    width,
    height,
    "/images/HALmeteorite.png",
    0.45
  );

  let y = height - topPadding;
  const headerY = y;
  const titleY = y - 12;
  const lineY = y - 26;

  page.drawText(theaterName, {
    x: marginX,
    y: headerY,
    size: headerSize,
    font,
    color: rgb(0, 0, 0),
  });

  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: titleY,
    size: titleSize,
    font,
    color: rgb(0, 0, 0),
  });

  const issuedWidth = font.widthOfTextAtSize(issuedAtText, issuedSize);
  page.drawText(issuedAtText, {
    x: width - marginX - issuedWidth,
    y: headerY,
    size: issuedSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: marginX, y: lineY },
    end: { x: width - marginX, y: lineY },
    thickness: 0.7,
    color: rgb(0, 0, 0),
  });

  y = lineY - 24;

  const nameLabel = "宛名";
  const nameLabelWidth = font.widthOfTextAtSize(nameLabel, headerSize);
  const nameValueX = marginX + nameLabelWidth + valueGap;
  page.drawText(nameLabel, {
    x: marginX,
    y,
    size: headerSize,
    font,
    color: rgb(0, 0, 0),
  });

  const nameLineWidth = Math.max(80, width - nameValueX - marginX - 12);
  page.drawLine({
    start: { x: nameValueX, y: y - 2 },
    end: { x: nameValueX + nameLineWidth, y: y - 2 },
    thickness: 0.7,
    color: rgb(0, 0, 0),
  });
  page.drawText("様", {
    x: nameValueX + nameLineWidth + 4,
    y,
    size: headerSize,
    font,
    color: rgb(0, 0, 0),
  });

  y -= nameBlockHeight;

  const tableTopY = y;
  page.drawText("項目", {
    x: marginX,
    y: tableTopY,
    size: headerSize,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText("内容", {
    x: colValueX,
    y: tableTopY,
    size: headerSize,
    font,
    color: rgb(0, 0, 0),
  });

  const headerLineY = tableTopY - 8;
  page.drawLine({
    start: { x: marginX, y: headerLineY },
    end: { x: width - marginX, y: headerLineY },
    thickness: 0.7,
    color: rgb(0, 0, 0),
  });

  let rowY = headerLineY - 12;
  rows.forEach((row, index) => {
    page.drawText(row.label, {
      x: marginX,
      y: rowY,
      size: headerSize,
      font,
      color: rgb(0, 0, 0),
    });

    const wrapped = wrappedRows[index];
    wrapped.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: colValueX,
        y: rowY - lineGap * lineIndex,
        size: headerSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const rowHeight = wrapped.length * lineGap;
    rowY -= rowHeight + rowGap;
  });

  const totalLabel = "合計金額（税込）";
  const totalValue = formatTotal(data.totalPrice);
  const totalLabelSize = 10;
  const totalValueSize = 12;
  const totalValueWidth = font.widthOfTextAtSize(totalValue, totalValueSize);
  const totalValueX = width - marginX - totalValueWidth;

  page.drawText(totalLabel, {
    x: marginX,
    y: rowY,
    size: totalLabelSize,
    font,
    color: rgb(0, 0, 0),
  });

  if (totalValueX - 6 < colValueX) {
    page.drawText(totalValue, {
      x: colValueX,
      y: rowY - lineGap,
      size: totalValueSize,
      font,
      color: rgb(0, 0, 0),
    });
  } else {
    page.drawText(totalValue, {
      x: totalValueX,
      y: rowY - 1,
      size: totalValueSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return pdfDoc.save();
};

const buildTicketLayout = async (data: PdfSourceData): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit as any);
  const font = await loadFont(pdfDoc);

  const ticketWidth = mmToPt(150);
  const ticketHeight = mmToPt(57);
  const marginX = 16;
  const marginY = 12;
  const sectionGap = 10;
  const lineGap = 12;
  const rowGap = 4;
  const headerSize = 10;
  const titleSize = 14;
  const infoSize = 9;
  const seatLabelSize = 9;
  const seatValueSize = 14;

  const page = pdfDoc.addPage([ticketWidth, ticketHeight]);
  const { width, height } = page.getSize();

  await drawBackground(
    pdfDoc,
    page,
    width,
    height,
    "/images/theater-interior-1.png",
    0.2
  );

  const theaterName = "HAL CINEMA";
  const title = "入場券";
  const topY = height - marginY;

  page.drawText(theaterName, {
    x: marginX,
    y: topY,
    size: headerSize,
    font,
    color: rgb(0, 0, 0),
  });

  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: topY - 6,
    size: titleSize,
    font,
    color: rgb(0, 0, 0),
  });

  const leftWidth = width * 0.62;
  const rightX = marginX + leftWidth + sectionGap;
  const rightWidth = width - rightX - marginX;
  const labels = ["作品名", "日時", "スクリーン"];
  const labelWidth = Math.max(
    ...labels.map((label) => font.widthOfTextAtSize(label, infoSize))
  );
  const valueX = marginX + labelWidth + 6;
  const maxValueWidth = Math.max(40, rightX - valueX - sectionGap);

  const dividerX = rightX - sectionGap / 2;
  const dividerTop = height - marginY - 6;
  const dividerBottom = marginY + 6;
  const dashLength = 6;
  const dashGap = 4;

  page.drawText("切り取り線", {
    x: dividerX - font.widthOfTextAtSize("切り取り線", 7) / 2,
    y: dividerTop + 2,
    size: 7,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  for (
    let lineY = dividerTop;
    lineY > dividerBottom;
    lineY -= dashLength + dashGap
  ) {
    page.drawLine({
      start: { x: dividerX, y: lineY },
      end: { x: dividerX, y: Math.max(dividerBottom, lineY - dashLength) },
      thickness: 0.7,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  let y = topY - 22;
  const rows: { label: string; value: string }[] = [
    { label: "作品名", value: safeText(data.movieTitle) },
    { label: "日時", value: safeText(formatScreening(data.date, data.time)) },
    { label: "スクリーン", value: safeText(data.screen) },
  ];

  rows.forEach((row) => {
    page.drawText(row.label, {
      x: marginX,
      y,
      size: infoSize,
      font,
      color: rgb(0, 0, 0),
    });

    const wrapped = wrapText(row.value, maxValueWidth, font, infoSize);
    wrapped.forEach((line, index) => {
      page.drawText(line, {
        x: valueX,
        y: y - lineGap * index,
        size: infoSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const rowHeight = wrapped.length * lineGap;
    y -= rowHeight + rowGap;
  });

  const rightTopY = topY - 22;
  let rightY = rightTopY;
  const rightInfoSize = 8;
  const rightLabelWidth = Math.max(
    font.widthOfTextAtSize("作品名", rightInfoSize),
    font.widthOfTextAtSize("日時", rightInfoSize),
    font.widthOfTextAtSize("スクリーン", rightInfoSize)
  );
  const rightValueX = rightX + rightLabelWidth + 4;
  const rightMaxWidth = Math.max(40, rightX + rightWidth - rightValueX);

  const rightRows: { label: string; value: string }[] = [
    { label: "作品名", value: safeText(data.movieTitle) },
    { label: "日時", value: safeText(formatScreening(data.date, data.time)) },
    { label: "スクリーン", value: safeText(data.screen) },
  ];

  rightRows.forEach((row) => {
    page.drawText(row.label, {
      x: rightX,
      y: rightY,
      size: rightInfoSize,
      font,
      color: rgb(0, 0, 0),
    });

    const wrapped = wrapText(row.value, rightMaxWidth, font, rightInfoSize);
    wrapped.forEach((line, index) => {
      page.drawText(line, {
        x: rightValueX,
        y: rightY - lineGap * index,
        size: rightInfoSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const rowHeight = wrapped.length * lineGap;
    rightY -= rowHeight + rowGap;
  });

  const seatLabelY = Math.min(rightY, rightTopY - 40);
  page.drawText("座席", {
    x: rightX,
    y: seatLabelY,
    size: seatLabelSize,
    font,
    color: rgb(0, 0, 0),
  });

  const seatText = formatSeats(data.seatTickets).join(" / ");
  const seatLines = wrapText(seatText, rightWidth, font, seatValueSize);
  seatLines.forEach((line, index) => {
    page.drawText(line, {
      x: rightX,
      y: seatLabelY - (lineGap + 4) - lineGap * index,
      size: seatValueSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return pdfDoc.save();
};

export const buildReceiptPdf = (data: PdfSourceData) => buildReceiptLayout(data);

export const buildTicketPdf = (data: PdfSourceData) => buildTicketLayout(data);
