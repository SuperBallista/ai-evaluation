declare module "qrcode" {
    export function toDataURL(
      text: string,
      options?: { width?: number },
      callback?: (error: Error | null, url: string) => void
    ): void;
  
    export function toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      options?: { width?: number }
    ): Promise<void>;
  
    export function toString(
      text: string,
      options?: { type?: "svg" | "utf8" | "terminal" }
    ): Promise<string>;
  }
  