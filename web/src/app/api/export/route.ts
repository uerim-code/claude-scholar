import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  TabStopPosition,
  TabStopType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageNumber,
  Header,
  Footer,
  NumberFormat,
} from "docx";

function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        paragraphs.push(
          new Paragraph({
            border: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            shading: { fill: "F5F5F5" },
            children: [
              new TextRun({
                text: codeLines.join("\n"),
                font: "Courier New",
                size: 18,
                color: "333333",
              }),
            ],
            spacing: { before: 100, after: 100 },
          })
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Table detection
    if (line.includes("|") && line.trim().startsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
      if (cells.length > 0 && !line.match(/^\|[\s-:|]+\|$/)) {
        if (!inTable) inTable = true;
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      // Flush table
      if (tableRows.length > 0) {
        const colCount = Math.max(...tableRows.map((r) => r.length));
        const table = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows.map((row, ri) =>
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
                      alignment: AlignmentType.LEFT,
                      spacing: { before: 40, after: 40 },
                    }),
                  ],
                  shading: ri === 0 ? { fill: "E8E8E8" } : undefined,
                })
              ),
            })
          ),
        });
        paragraphs.push(new Paragraph({ spacing: { before: 100 } }));
        paragraphs.push(table as unknown as Paragraph);
        paragraphs.push(new Paragraph({ spacing: { after: 100 } }));
      }
      tableRows = [];
      inTable = false;
    }

    // Empty line
    if (line.trim() === "") {
      paragraphs.push(new Paragraph({ spacing: { before: 60, after: 60 } }));
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              text: line.replace("### ", "").replace(/\*\*/g, ""),
              bold: true,
              size: 24,
              font: "Times New Roman",
            }),
          ],
          spacing: { before: 240, after: 120 },
        })
      );
      continue;
    }
    if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: line.replace("## ", "").replace(/\*\*/g, ""),
              bold: true,
              size: 28,
              font: "Times New Roman",
            }),
          ],
          spacing: { before: 360, after: 120 },
        })
      );
      continue;
    }
    if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: line.replace("# ", "").replace(/\*\*/g, ""),
              bold: true,
              size: 32,
              font: "Times New Roman",
            }),
          ],
          spacing: { before: 480, after: 240 },
        })
      );
      continue;
    }

    // Bullet points
    if (line.match(/^[-*] /)) {
      const text = line.replace(/^[-*] /, "");
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: parseInlineFormatting(text),
          spacing: { before: 40, after: 40 },
        })
      );
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s/);
    if (numMatch) {
      const text = line.replace(/^\d+\.\s/, "");
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${numMatch[1]}. `, bold: true, size: 22, font: "Times New Roman" }),
            ...parseInlineFormatting(text),
          ],
          spacing: { before: 40, after: 40 },
          indent: { left: 360 },
        })
      );
      continue;
    }

    // Regular paragraph
    paragraphs.push(
      new Paragraph({
        children: parseInlineFormatting(line),
        spacing: { before: 60, after: 60, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  // Flush remaining table
  if (inTable && tableRows.length > 0) {
    const colCount = Math.max(...tableRows.map((r) => r.length));
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows.map((row, ri) =>
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
                }),
              ],
              shading: ri === 0 ? { fill: "E8E8E8" } : undefined,
            })
          ),
        })
      ),
    });
    paragraphs.push(table as unknown as Paragraph);
  }

  return paragraphs;
}

function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];
  // Split by bold (**text**) and italic (*text*) and code (`text`)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({
        text: part.slice(2, -2),
        bold: true,
        size: 22,
        font: "Times New Roman",
      }));
    } else if (part.startsWith("*") && part.endsWith("*")) {
      runs.push(new TextRun({
        text: part.slice(1, -1),
        italics: true,
        size: 22,
        font: "Times New Roman",
      }));
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(new TextRun({
        text: part.slice(1, -1),
        font: "Courier New",
        size: 20,
        shading: { fill: "F0F0F0" },
      }));
    } else {
      runs.push(new TextRun({
        text: part,
        size: 22,
        font: "Times New Roman",
      }));
    }
  }

  return runs;
}

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Icerik belirtilmedi" }, { status: 400 });
    }

    const docTitle = title || "Claude Scholar - Rapor";
    const now = new Date();
    const dateStr = now.toLocaleDateString("tr-TR", {
      year: "numeric", month: "long", day: "numeric",
    });

    const bodyParagraphs = parseMarkdownToDocx(content);

    const doc = new Document({
      creator: "Claude Scholar",
      title: docTitle,
      description: "Claude Scholar tarafindan olusturulmustur",
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: docTitle,
                      italics: true,
                      size: 18,
                      font: "Times New Roman",
                      color: "888888",
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 18,
                      font: "Times New Roman",
                      color: "888888",
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            // Title
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: docTitle,
                  bold: true,
                  size: 36,
                  font: "Times New Roman",
                }),
              ],
              spacing: { after: 200 },
            }),
            // Date
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: dateStr,
                  size: 22,
                  font: "Times New Roman",
                  color: "666666",
                }),
              ],
              spacing: { after: 120 },
            }),
            // Author
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Claude Scholar ile olusturulmustur",
                  italics: true,
                  size: 20,
                  font: "Times New Roman",
                  color: "888888",
                }),
              ],
              spacing: { after: 480 },
            }),
            // Divider
            new Paragraph({
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              },
              spacing: { after: 360 },
            }),
            // Content
            ...bodyParagraphs,
          ],
        },
      ],
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
    return NextResponse.json({ error: err.message || "Word dosyasi olusturulamadi" }, { status: 500 });
  }
}
