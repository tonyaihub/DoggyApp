/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online Walking Dog Detail Modal with "Wave Paw" Interaction
 */

import React, { useState } from 'react';
import { Dog, MapPin, Clock, Footprints, Shield, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { LiveWalkingDog } from '../data/zaporizhzhia';
import { useI18n } from '../lib/i18n/context';

interface DogDetailModalProps {
  dog: LiveWalkingDog | null;
  onClose: () => void;
  onStartChat?: (dog: LiveWalkingDog) => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({ dog, onClose, onStartChat }) => {
  const { t } = useI18n();
  const [pawWaved, setPawWaved] = useState(false);

  if (!dog) return null;

  const handleWave = () => {
    setPawWaved(true);
    setTimeout(() => setPawWaved(false), 2500);
  };

  const getTemperamentBadge = () => {
    if (dog.pet.temperament === 'friendly') {
      return {
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        label: t.map.friendly,
        desc: 'Обожнює гратися з іншими собаками та людьми',
      };
    }
    if (dog.pet.temperament === 'neutral') {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        label: t.map.neutral,
        desc: 'Спокійний, але потрібне плавне знайомство на повідку',
      };
    }
    return {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      label: t.map.cautious,
      desc: 'Тримайте дистанцію, пес може захищати особистий простір',
    };
  };

  const badge = getTemperamentBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
        {/* Iridescent background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-indigo-500/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold z-10 transition"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full border-2 border-white/20 shadow-2xl overflow-hidden bg-zinc-900 ring-4 ring-indigo-500/20">
              <img src={dog.pet.avatar_url} alt={dog.pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 font-black text-[9px] tracking-wider uppercase shadow-[0_0_8px_#10b981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping" />
              LIVE
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">{dog.pet.name}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {dog.pet.breed} • {dog.pet.age_years} роки
          </p>
          <p className="text-[11px] text-indigo-400 mt-1 font-medium">Господар: {dog.owner_name}</p>

          {/* Temperament badge */}
          <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-semibold ${badge.bg}`}>
            {badge.label}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1.5 px-4 leading-relaxed">{badge.desc}</p>

          {/* Walk Stats */}
          <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col items-center">
              <Clock className="w-4 h-4 text-indigo-400 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Час вигулу</span>
              <span className="text-base font-bold text-white mt-0.5 font-mono">{dog.walk_duration_mins} хв</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col items-center">
              <Footprints className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Пройдено</span>
              <span className="text-base font-bold text-white mt-0.5 font-mono">{dog.distance_walked_km} км</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full mt-5 space-y-2">
            <button
              onClick={handleWave}
              className={`w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(255,255,255,0.2)] active:scale-95 ${
                pawWaved
                  ? 'bg-emerald-500 text-white shadow-emerald-950/50'
                  : 'bg-white text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{pawWaved ? t.map.paw_waved : t.map.wave_paw + ' 🐾'}</span>
            </button>

            {onStartChat && (
              <button
                onClick={() => {
                  onStartChat(dog);
                  onClose();
                }}
                className="w-full py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-white/10 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Запросити на вигул у чаті</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
