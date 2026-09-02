/**
 * AHAR X — OCR / Text Extraction Service
 * 
 * Abstraction layer for extracting text from food label images.
 * 
 * Architecture:
 *   Image → OCR Provider → Extracted Text → Structured Data
 * 
 * For this prototype, we provide mock/demo extraction.
 * The code is structured so a real OCR provider (Google Vision, Tesseract, etc.)
 * can be plugged in by implementing the `extractText` function.
 * 
 * IMPORTANT: Never pretend mock data came from real OCR.
 */

export interface OcrResult {
  success: boolean;
  extractedText: string;
  confidence: number;
  error?: string;
}

export interface ExtractedFoodData {
  productName: string | null;
  nutritionRaw: string | null;
  ingredientsRaw: string | null;
  claimsRaw: string[];
}

/**
 * Extract text from an image file using OCR.
 * 
 * Currently returns mock data for demonstration.
 * To integrate a real OCR provider:
 *   1. Call the provider API (e.g., Google Vision, Tesseract.js)
 *   2. Parse the response
 *   3. Return an OcrResult
 */
export async function extractTextFromImage(
  _file: File,
): Promise<OcrResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock result — clearly marked as demo
  return {
    success: false,
    extractedText: "",
    confidence: 0,
    error:
      "OCR is not configured in this prototype. Please use the demo products to see the full analysis pipeline.",
  };
}

/**
 * Parse raw OCR text into structured food data.
 * 
 * For the prototype, this is a placeholder showing the expected interface.
 * A real implementation would use regex/NLP to parse the extracted text.
 */
export function parseOcrText(_rawText: string): ExtractedFoodData {
  return {
    productName: null,
    nutritionRaw: null,
    ingredientsRaw: null,
    claimsRaw: [],
  };
}

/**
 * Validate that an uploaded file is a supported image type.
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Please upload a JPEG, PNG, or WebP image.`,
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File is too large. Please upload an image smaller than 10MB.",
    };
  }

  return { valid: true };
}
