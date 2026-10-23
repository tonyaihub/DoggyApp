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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative text-center">
        {/* Decorative badge */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center shadow-xl shadow-indigo-950/40 mb-4 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-black text-white">{t.walk.finish_dialog_title}</h3>
        <p className="text-xs text-zinc-400 mt-1">{t.walk.finish_dialog_sub}</p>

        {/* Pet badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700">
          <img
            src={session.pet_avatar}
            alt={session.pet_name}
            className="w-5 h-5 rounded-full object-cover border border-indigo-400"
          />
          <span className="text-xs font-semibold text-zinc-200">
            {session.pet_name} • Запоріжжя
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex flex-col items-center">
            <Footprints className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">{t.walk.distance}</span>
            <span className="text-xl font-black text-white mt-0.5">{distanceKm} км</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex flex-col items-center">
            <Clock className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">{t.walk.time}</span>
            <span className="text-xl font-black text-white mt-0.5">{durationText}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex flex-col items-center">
            <Flame className="w-5 h-5 text-rose-400 mb-1" />
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">{t.walk.calories}</span>
            <span className="text-xl font-black text-white mt-0.5">{session.calories_burned || 180} ккал</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex flex-col items-center">
            <Heart className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Сер. швидкість</span>
            <span className="text-xl font-black text-white mt-0.5">{avgSpeed} км/г</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={handleShare}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isShared
                ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
            }`}
          >
            {isShared ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.walk.shared_success}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>{t.walk.share_district}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
          >
            {t.walk.save_close}
          </button>
        </div>
      </div>
    </div>
  );
};
