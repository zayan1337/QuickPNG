import { removeBackground } from '@imgly/background-removal';
import type { RemovalResult } from './types';

export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<RemovalResult> {
  const config = {
    progress: (key: string, current: number, total: number) => {
      if (!onProgress) return;

      const percent = total > 0 ? Math.round((current / total) * 100) : -1;

      if (key.includes('download') || key.includes('fetch')) {
        onProgress(percent, 'Downloading AI model...');
      } else if (key.includes('compute') || key.includes('inference')) {
        onProgress(percent, 'Removing background...');
      } else {
        onProgress(percent, 'Processing...');
      }
    },
    output: {
      format: 'image/png' as const,
      quality: 1,
    },
  };

  const resultBlob = await removeBackground(file, config);

  const objectUrl = URL.createObjectURL(resultBlob);
  const dimensions = await getImageDimensions(objectUrl);

  const originalName = file.name.replace(/\.[^.]+$/, '');
  const filename = `${originalName}-transparent.png`;

  return {
    blob: resultBlob,
    objectUrl,
    width: dimensions.width,
    height: dimensions.height,
    filename,
  };
}

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to read image dimensions'));
    img.src = url;
  });
}
