import './style.css';
import { initDropzone } from './dropzone';
import { removeImageBackground } from './background-remover';
import { transitionTo, showOriginalPreview, updateProgress, showResult, showError } from './ui';

// --- State ---
let currentOriginalUrl: string | null = null;
let currentResultUrl: string | null = null;

// --- DOM refs ---
const dropzone = document.getElementById('dropzone')!;
const fileInput = document.getElementById('file-input') as HTMLInputElement;

// --- Handlers ---

function cleanup(): void {
  if (currentOriginalUrl) {
    URL.revokeObjectURL(currentOriginalUrl);
    currentOriginalUrl = null;
  }
  if (currentResultUrl) {
    URL.revokeObjectURL(currentResultUrl);
    currentResultUrl = null;
  }
}

async function handleFile(file: File): Promise<void> {
  cleanup();

  const originalUrl = URL.createObjectURL(file);
  currentOriginalUrl = originalUrl;
  showOriginalPreview(originalUrl);

  transitionTo('processing');
  updateProgress(-1, 'Initializing AI model...');

  try {
    const result = await removeImageBackground(file, (progress, message) => {
      updateProgress(progress, message);
    });

    currentResultUrl = result.objectUrl;
    showResult(result, originalUrl);
    transitionTo('preview');
  } catch (error) {
    console.error('Background removal failed:', error);

    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('WebAssembly') || message.includes('wasm')) {
      showError('Your browser does not support WebAssembly. Please use a modern browser.');
    } else if (message.includes('fetch') || message.includes('network') || message.includes('download')) {
      showError('Failed to download AI model. Please check your internet connection and try again.');
    } else {
      showError('Background removal failed. Please try a different image.');
    }

    transitionTo('upload');
  }
}

function resetApp(): void {
  cleanup();
  transitionTo('upload');
}

// --- Initialize ---

initDropzone(dropzone, fileInput, handleFile, showError);

document.getElementById('try-another')!.addEventListener('click', resetApp);
document.getElementById('start-over')!.addEventListener('click', resetApp);

transitionTo('upload');
