'use client';
export function toast(message: string) {
  const el = document.getElementById('toaster'); if (!el) return;
  const item = document.createElement('div'); item.className = 'toast'; item.role = 'alert'; item.textContent = message; el.appendChild(item);
  setTimeout(() => { item.classList.add('out'); setTimeout(() => item.remove(), 300); }, 2200);
}