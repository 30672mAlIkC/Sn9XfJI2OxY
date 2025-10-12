// 代码生成时间: 2025-10-13 00:00:29
import { PrismaClient } from '@prisma/client';
import { TesseractOCR } from 'tesseract.js';
import { Readable } from 'stream';

// Initialize Prisma Client for database operations
const prisma = new PrismaClient();

// OCRService class
class OCRService {
  // Perform OCR on an image file
  async performOCR(imagePath: string): Promise<string> {
    try {
      // Initialize Tesseract OCR
      const ocr = new TesseractOCR();

      // Load the language model for English (or any other desired language)
      await ocr.load();
      await ocr.loadLanguage('eng');
      await ocr.initialize('eng');

      // Read the image file
      const imageStream = await readFileAsStream(imagePath);

      // Recognize the text in the image
      const { data: { text } } = await ocr.recognize(imageStream);

      // Return the extracted text
      return text;
    } catch (error) {
      // Handle any errors that occur during the OCR process
      console.error('Error during OCR:', error);
      throw new Error('Failed to perform OCR');
    }
  }
}

// Helper function to read a file as a stream
async function readFileAsStream(filePath: string): Promise<Readable> {
  try {
    return createReadStream(filePath);
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to read file');
  }
}

// Export the OCRService class
export default OCRService;

// Example usage of the OCRService
// async function main() {
//   const ocrService = new OCRService();
//   try {
//     const text = await ocrService.performOCR('./path/to/image.png');
//     console.log('Extracted Text:', text);
//   } catch (error) {
//     console.error(error.message);
//   }
// }
// main();