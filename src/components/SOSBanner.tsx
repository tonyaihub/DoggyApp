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
    <div className="relative z-20 bg-zinc-950/80 backdrop-blur-2xl border-b border-rose-500/25 px-4 py-2 shadow-lg transition-all animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Alert Info */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
            <div className="relative w-8 h-8 rounded-full border border-rose-400 overflow-hidden bg-rose-950 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
              <img src={alert.pet_avatar} alt={alert.pet_name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-[9px] uppercase border border-rose-500/30">
                SOS
              </span>
              <span className="text-xs font-semibold text-white tracking-tight">
                {alert.pet_name} · <span className="text-zinc-400 font-normal">{alert.pet_breed}</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.2 max-w-md line-clamp-1">
              📍 {alert.last_seen_address} · Винагорода:{' '}
              <span className="text-amber-300 font-bold">{alert.reward_amount} ₴</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onOpenSighting(alert)}
            className="px-3 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold shadow-[0_2px_12px_rgba(255,255,255,0.2)] transition flex items-center gap-1.5 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.sos.i_saw_dog}</span>
          </button>

          <button
            onClick={() => onOpenAlert(alert)}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs transition"
            title="Детальніше"
          >
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
