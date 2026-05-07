declare module "@qvac/sdk" {
  export const OCR_LATIN_RECOGNIZER_1: unknown;
  export function loadModel(options: {
    modelSrc: unknown;
    modelType: string;
    modelConfig?: Record<string, unknown>;
  }): Promise<string>;
  export function ocr(options: {
    modelId: string;
    image: Buffer;
    options?: Record<string, unknown>;
  }): { blocks: Promise<Array<{ text: string; bbox?: [number, number, number, number]; confidence?: number }>> };
}
