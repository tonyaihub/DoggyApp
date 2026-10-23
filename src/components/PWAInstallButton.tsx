/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * In-App PWA Install Prompt Component (Chromium + iOS Safari modal)
 */

import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useI18n } from '../lib/i18n/context';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useI18n();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t.pwa.install_btn}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>iOS Додаток</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative text-left">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-2">{t.pwa.ios_guide_title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Встановіть DogApp на головний екран вашого iPhone або iPad для роботи офлайн та швидкого запуску:
              </p>

              <div className="space-y-3 bg-zinc-800/60 p-3.5 rounded-2xl border border-zinc-700/60 text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <span>
                    Натисніть кнопку <Share className="w-3.5 h-3.5 inline mx-1 text-indigo-400" /> "Поділитися" на
                    панелі Safari
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <span>
                    Прокрутіть меню та виберіть{' '}
                    <strong className="text-white">"На початковий екран"</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
