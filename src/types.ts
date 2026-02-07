export type AppState = 'upload' | 'processing' | 'preview';

export interface RemovalResult {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  filename: string;
}
