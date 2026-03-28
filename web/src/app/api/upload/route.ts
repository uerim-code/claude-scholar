import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import * as XLSX from "xlsx";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const TEXT_EXTENSIONS = [
  ".csv", ".json", ".md", ".txt", ".py", ".yaml", ".yml",
  ".tex", ".bib", ".tsv", ".log", ".xml", ".html", ".js",
  ".ts", ".jsx", ".tsx", ".r", ".sql", ".sh", ".cfg", ".ini",
  ".toml", ".env",
];

const EXCEL_EXTENSIONS = [".xlsx", ".xls", ".xlsm", ".xlsb", ".ods"];

function parseExcel(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const results: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
    const rowCount = json.length;
    const colCount = json[0]?.length || 0;

    results.push(`## Sayfa: ${sheetName} (${rowCount} satir, ${colCount} sutun)\n`);
    results.push(csv.substring(0, 40000));
  }

  return results.join("\n\n");
}

function isTextFile(filename: string, mimeType: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return TEXT_EXTENSIONS.includes(ext) || mimeType.startsWith("text/");
}

function isExcelFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return EXCEL_EXTENSIONS.includes(ext);
}

export async function POST(request: NextRequest) {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadi" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    writeFileSync(filepath, buffer);

    let content: string | null = null;

    if (isExcelFile(file.name)) {
      content = parseExcel(buffer);
    } else if (isTextFile(file.name, file.type)) {
      content = buffer.toString("utf-8").substring(0, 50000);
    }

    return NextResponse.json({
      success: true,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      path: filepath,
      content,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || "Dosya yuklenemedi" }, { status: 500 });
  }
}
