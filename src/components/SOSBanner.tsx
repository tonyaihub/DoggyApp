/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * High-Urgency SOS Banner for nearby lost dogs
 */

import React from 'react';
import { AlertCircle, ChevronRight, Eye, Phone } from 'lucide-react';
import { SOSAlertEntity } from '../types/database';
import { useI18n } from '../lib/i18n/context';

interface SOSBannerProps {
  alert: SOSAlertEntity;
  onOpenAlert: (alert: SOSAlertEntity) => void;
  onOpenSighting: (alert: SOSAlertEntity) => void;
}

export const SOSBanner: React.FC<SOSBannerProps> = ({ alert, onOpenAlert, onOpenSighting }) => {
  const { t } = useI18n();

  return (
    <div className="relative z-20 bg-gradient-to-r from-rose-950/95 via-rose-900/90 to-zinc-950/95 border-b border-rose-500/40 px-4 py-2.5 shadow-xl animate-in slide-in-from-top-4 duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Alert Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <span className="absolute -inset-1 rounded-full bg-rose-500 animate-ping opacity-50" />
            <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-rose-950">
              <img src={alert.pet_avatar} alt={alert.pet_name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider">
                SOS РАДАР
              </span>
              <span className="text-xs font-bold text-white">
                Пропав пес: {alert.pet_name} ({alert.pet_breed})
              </span>
            </div>
            <p className="text-[11px] text-rose-200/90 mt-0.5 max-w-md line-clamp-1">
              📍 {alert.last_seen_address} • Винагорода:{' '}
              <strong className="text-amber-300 font-bold">{alert.reward_amount} ₴</strong>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onOpenSighting(alert)}
            className="px-3 py-1.5 rounded-xl bg-white text-rose-900 hover:bg-rose-100 text-xs font-black shadow transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.sos.i_saw_dog}</span>
          </button>

          <button
            onClick={() => onOpenAlert(alert)}
            className="p-1.5 rounded-xl bg-rose-800/80 hover:bg-rose-700 text-white text-xs font-semibold transition"
            title="Детальніше"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
