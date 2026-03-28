import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageNumber,
  Header,
  Footer,
  ISectionOptions,
} from "docx";

type DocChild = Paragraph | Table;

function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, size: 24, font: "Times New Roman" }));
    } else if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      runs.push(new TextRun({ text: part.slice(1, -1), italics: true, size: 24, font: "Times New Roman" }));
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(new TextRun({ text: part.slice(1, -1), font: "Courier New", size: 20 }));
    } else {
      runs.push(new TextRun({ text: part, size: 24, font: "Times New Roman" }));
    }
  }
  return runs.length > 0 ? runs : [new TextRun({ text, size: 24, font: "Times New Roman" })];
}

function buildTable(rows: string[][]): Table {
  const colCount = Math.max(...rows.map((r) => r.length));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, ri) =>
      new TableRow({
        children: Array.from({ length: colCount }, (_, ci) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row[ci] || "",
                    bold: ri === 0,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
                spacing: { before: 40, after: 40 },
              }),
            ],
            shading: ri === 0 ? { fill: "D9E2F3" } : undefined,
          })
        ),
      })
    ),
  });
}

function parseMarkdownToDocChildren(markdown: string): DocChild[] {
  const children: DocChild[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      children.push(buildTable(tableRows));
      children.push(new Paragraph({ spacing: { after: 120 } }));
      tableRows = [];
    }
  };

  for (const line of lines) {
    // Code block toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        children.push(new Paragraph({
          shading: { fill: "F2F2F2" },
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
          children: [new TextRun({ text: codeLines.join("\n"), font: "Courier New", size: 18, color: "333333" })],
          spacing: { before: 120, after: 120 },
        }));
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    // Table row
    if (line.includes("|") && line.trim().startsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
      // Skip separator rows like |---|---|
      if (cells.length > 0 && !cells.every((c) => /^[-:]+$/.test(c))) {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Empty line
    if (line.trim() === "") {
      children.push(new Paragraph({ spacing: { before: 80, after: 80 } }));
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      children.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
        spacing: { before: 120, after: 120 },
      }));
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: line.replace(/^# /, "").replace(/\*\*/g, ""), bold: true, size: 32, font: "Times New Roman" })],
        spacing: { before: 480, after: 240 },
      }));
      continue;
    }
    if (line.startsWith("## ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: line.replace(/^## /, "").replace(/\*\*/g, ""), bold: true, size: 28, font: "Times New Roman" })],
        spacing: { before: 360, after: 120 },
      }));
      continue;
    }
    if (line.startsWith("### ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: line.replace(/^### /, "").replace(/\*\*/g, ""), bold: true, size: 26, font: "Times New Roman" })],
        spacing: { before: 240, after: 120 },
      }));
      continue;
    }

    // Bullet points
    if (line.match(/^[-*] /)) {
      children.push(new Paragraph({
        bullet: { level: 0 },
        children: parseInlineFormatting(line.replace(/^[-*] /, "")),
        spacing: { before: 40, after: 40 },
      }));
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${numMatch[1]}. `, bold: true, size: 24, font: "Times New Roman" }),
          ...parseInlineFormatting(numMatch[2]),
        ],
        spacing: { before: 40, after: 40 },
        indent: { left: 360 },
      }));
      continue;
    }

    // Block quote
    if (line.startsWith("> ")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^> /, ""), italics: true, size: 22, font: "Times New Roman", color: "555555" })],
        indent: { left: 720 },
        border: { left: { style: BorderStyle.SINGLE, size: 3, color: "6366F1" } },
        spacing: { before: 60, after: 60 },
      }));
      continue;
    }

    // Regular paragraph
    children.push(new Paragraph({
      children: parseInlineFormatting(line),
      spacing: { before: 60, after: 60, line: 360 },
      alignment: AlignmentType.JUSTIFIED,
    }));
  }

  // Flush remaining
  flushTable();

  return children;
}

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Icerik belirtilmedi" }, { status: 400 });
    }

    const docTitle = title || "Claude Scholar - Rapor";
    const now = new Date();
    const dateStr = now.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

    const bodyChildren = parseMarkdownToDocChildren(content);

    const sectionOptions: ISectionOptions = {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: docTitle, italics: true, size: 18, font: "Times New Roman", color: "888888" })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Times New Roman", color: "888888" })],
          })],
        }),
      },
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: docTitle, bold: true, size: 36, font: "Times New Roman" })],
          spacing: { after: 200 },
        }),
        // Date
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: dateStr, size: 22, font: "Times New Roman", color: "666666" })],
          spacing: { after: 120 },
        }),
        // Attribution
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Claude Scholar ile olusturulmustur", italics: true, size: 20, font: "Times New Roman", color: "888888" })],
          spacing: { after: 480 },
        }),
        // Divider
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
          spacing: { after: 360 },
        }),
        // Body content
        ...bodyChildren,
      ],
    };

    const doc = new Document({
      creator: "Claude Scholar",
      title: docTitle,
      sections: [sectionOptions],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(docTitle)}.docx"`,
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Export error:", err.message);
    return NextResponse.json({ error: err.message || "Word dosyasi olusturulamadi" }, { status: 500 });
  }
}
