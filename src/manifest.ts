/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable';
}

export interface PWAShortcut {
  name: string;
  short_name?: string;
  description?: string;
  url: string;
  icons?: Array<{ src: string; sizes: string }>;
}

export interface PWAManifest {
  id: string;
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  scope: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: string;
  theme_color: string;
  background_color: string;
  icons: PWAIcon[];
  shortcuts: PWAShortcut[];
  categories: string[];
}

export const manifest: PWAManifest = {
  id: '/',
  name: 'DogApp - Запоріжжя | Соціальна мережа & SOS-радар',
  short_name: 'DogApp',
  description: 'PWA для власників собак: GPS-трекер прогулянок, SOS-радар зниклих собак та мапа дог-локацій у Запоріжжі.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait-primary',
  theme_color: '#09090b',
  background_color: '#09090b',
  icons: [
    {
      src: '/icon.svg',
      sizes: '192x192 512x512',
      type: 'image/svg+xml',
      purpose: 'any',
    },
    {
      src: '/icon.svg',
      sizes: '512x512',
      type: 'image/svg+xml',
      purpose: 'maskable',
    },
  ],
  shortcuts: [
    {
      name: 'Почати вигул',
      short_name: 'Вигул',
      description: 'Запустити GPS-трекер прогулянки з собакою',
      url: '/?action=walk',
      icons: [{ src: '/icon.svg', sizes: '96x96' }],
    },
    {
      name: 'SOS Радар',
      short_name: 'SOS',
      description: 'Пошук зниклих собак Запоріжжя',
      url: '/?action=sos',
      icons: [{ src: '/icon.svg', sizes: '96x96' }],
    },
    {
      name: 'Додати небезпеку',
      short_name: 'Небезпека',
      description: 'Відмітити отруту, скло чи зграю собак',
      url: '/?action=hazard',
      icons: [{ src: '/icon.svg', sizes: '96x96' }],
    },
  ],
  categories: ['social', 'lifestyle', 'navigation'],
};

export default function getManifest(): PWAManifest {
  return manifest;
}
