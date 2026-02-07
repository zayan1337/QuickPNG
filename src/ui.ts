import type { AppState, RemovalResult } from './types';

const sections: Record<AppState, string> = {
  upload: 'upload-section',
  processing: 'processing-section',
  preview: 'preview-section',
};

export function transitionTo(state: AppState): void {
  Object.entries(sections).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (key === state) {
      el.removeAttribute('hidden');
      requestAnimationFrame(() => {
        el.classList.add('active');
      });
    } else {
      el.classList.remove('active');
      el.setAttribute('hidden', '');
    }
  });
}

export function showOriginalPreview(objectUrl: string): void {
  const img = document.getElementById('original-preview') as HTMLImageElement;
  img.src = objectUrl;
}

export function updateProgress(percent: number, message: string): void {
  const bar = document.getElementById('progress-bar') as HTMLElement;
  const text = document.getElementById('progress-text') as HTMLElement;

  if (percent >= 0) {
    bar.style.width = `${percent}%`;
    bar.classList.remove('indeterminate');
  } else {
    bar.classList.add('indeterminate');
  }

  text.textContent = message;
}

export function showResult(result: RemovalResult, originalUrl: string): void {
  const resultImg = document.getElementById('result-image') as HTMLImageElement;
  resultImg.src = result.objectUrl;

  const originalImg = document.getElementById('compare-original') as HTMLImageElement;
  originalImg.src = originalUrl;

  const dims = document.getElementById('result-dims');
  if (dims) dims.textContent = `${result.width} \u00D7 ${result.height} px \u2022 PNG`;

  const link = document.getElementById('download-link') as HTMLAnchorElement;
  link.href = result.objectUrl;
  link.download = result.filename;
}

export function showError(message: string): void {
  const existing = document.querySelector('.toast-error');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-error';
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
