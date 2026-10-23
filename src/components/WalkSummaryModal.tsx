/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Walk Completion & Statistics Summary Modal
 */

import React, { useState } from 'react';
import { Trophy, Flame, Footprints, Clock, Share2, CheckCircle2, Heart } from 'lucide-react';
import { WalkSessionEntity } from '../types/database';
import { useI18n } from '../lib/i18n/context';
import { formatDuration } from '../hooks/useWalkTracker';

interface WalkSummaryModalProps {
  session: WalkSessionEntity | null;
  onClose: () => void;
  onShareToDistrictFeed?: (session: WalkSessionEntity) => void;
}

export const WalkSummaryModal: React.FC<WalkSummaryModalProps> = ({
  session,
  onClose,
  onShareToDistrictFeed,
}) => {
  const { t } = useI18n();
  const [isShared, setIsShared] = useState(false);

  if (!session) return null;

  const distanceKm = (session.distance_meters / 1000).toFixed(2);
  const durationText = formatDuration(session.duration_seconds);
  const avgSpeed = session.duration_seconds > 0
    ? ((session.distance_meters / 1000) / (session.duration_seconds / 3600)).toFixed(1)
    : '0.0';

  const handleShare = () => {
    if (onShareToDistrictFeed) {
      onShareToDistrictFeed(session);
    }
    setIsShared(true);
    setTimeout(() => setIsShared(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative text-center">
        {/* Decorative badge */}
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 text-indigo-400 mx-auto flex items-center justify-center shadow-lg mb-3">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">{t.walk.finish_dialog_title}</h3>
        <p className="text-xs text-zinc-400 mt-0.5">{t.walk.finish_dialog_sub}</p>

        {/* Pet badge */}
        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
          <img
            src={session.pet_avatar}
            alt={session.pet_name}
            className="w-4 h-4 rounded-full object-cover border border-white/20"
          />
          <span className="text-xs font-medium text-zinc-200">
            {session.pet_name} · Запоріжжя
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col items-center">
            <Footprints className="w-4 h-4 text-indigo-400 mb-1" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">{t.walk.distance}</span>
            <span className="text-base font-bold text-white mt-0.5 font-mono">{distanceKm} км</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col items-center">
            <Clock className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">{t.walk.time}</span>
            <span className="text-base font-bold text-white mt-0.5 font-mono">{durationText}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col items-center">
            <Flame className="w-4 h-4 text-rose-400 mb-1" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">{t.walk.calories}</span>
            <span className="text-base font-bold text-white mt-0.5 font-mono">{session.calories_burned || 180} ккал</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col items-center">
            <Heart className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Сер. швидкість</span>
            <span className="text-base font-bold text-white mt-0.5 font-mono">{avgSpeed} км/г</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleShare}
            className={`w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isShared
                ? 'bg-emerald-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                : 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-[0_4px_20px_rgba(255,255,255,0.25)]'
            }`}
          >
            {isShared ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.walk.shared_success}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.walk.share_district}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 font-medium text-xs border border-white/[0.08] transition"
          >
            {t.walk.save_close}
          </button>
        </div>
      </div>
    </div>
  );
};
