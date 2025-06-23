import { getDocument } from "pdfjs/legacy/build/pdf.min.mjs";
import type { Metadata } from "pdfjs/types/pdf.d.ts";

/** The parsed pdf object which has a number of pages, the raw pdf info, the pdf metadata, and the text from the pdf */
export interface ParsedPdf {
  numPages: number;
  info: object | null;
  metadata: Metadata | null;
  text: string;
}

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * Parses a PDF document and extracts text content along with metadata
 * @param rawDoc - The PDF document as ArrayBuffer, TypedArray, string URL, or URL object
 * @param options - Optional configuration object
 * @param options.maxPages - Maximum number of pages to process (defaults to all pages)
 * @returns Promise that resolves to ParsedPdf object containing pages count, info, metadata, and extracted text
 */
export default async function parsePdf(
  rawDoc: ArrayBuffer | TypedArray | string | URL,
  options?: { maxPages?: number },
): Promise<ParsedPdf> {
  const doc = await getDocument({
    url: typeof rawDoc === "string" || rawDoc instanceof URL
      ? rawDoc
      : undefined,
    data: rawDoc instanceof ArrayBuffer || ArrayBuffer.isView(rawDoc)
      ? rawDoc
      : undefined,
    verbosity: 0,
  }).promise;

  const { metadata, info } = await doc.getMetadata().catch(() => {
    return { metadata: null, info: null };
  });

  const pagePromises = [];
  const iteratedPageCount = Math.min(
    options?.maxPages ?? Infinity,
    doc.numPages,
  );
  for (let i = 1; i <= iteratedPageCount; i++) {
    pagePromises.push((async () => {
      try {
        const pageProxy = await doc.getPage(i);
        const textContent = await pageProxy.getTextContent();

        let text = "";
        let lastY: number | undefined;
        for (const item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += "\n" + item.str;
          }
          lastY = item.transform[5];
        }

        return text;
      } catch {
        return "";
      }
    })());
  }

  const pageTexts = await Promise.all(pagePromises);

  return {
    numPages: doc.numPages,
    info,
    metadata,
    text: pageTexts.join("\n"),
  };
}
