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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow behind avatar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold z-10"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-xl overflow-hidden bg-zinc-800">
              <img src={dog.pet.avatar_url} alt={dog.pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping" />
              LIVE
            </div>
          </div>

          <h3 className="text-2xl font-black text-white">{dog.pet.name}</h3>
          <p className="text-sm text-zinc-400 mt-0.5">
            {dog.pet.breed} • {dog.pet.age_years} роки
          </p>
          <p className="text-xs text-indigo-400 mt-1">Господар: {dog.owner_name}</p>

          {/* Temperament badge */}
          <div className={`mt-3 px-3 py-1.5 rounded-xl border text-xs font-semibold ${badge.bg}`}>
            {badge.label}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 px-4">{badge.desc}</p>

          {/* Walk Stats */}
          <div className="grid grid-cols-2 gap-3 w-full mt-5">
            <div className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex flex-col items-center">
              <Clock className="w-4 h-4 text-indigo-400 mb-1" />
              <span className="text-xs text-zinc-400">Час вигулу</span>
              <span className="text-base font-bold text-white mt-0.5">{dog.walk_duration_mins} хв</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex flex-col items-center">
              <Footprints className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-xs text-zinc-400">Пройдено</span>
              <span className="text-base font-bold text-white mt-0.5">{dog.distance_walked_km} км</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full mt-6 space-y-2.5">
            <button
              onClick={handleWave}
              className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                pawWaved
                  ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{pawWaved ? t.map.paw_waved : t.map.wave_paw + ' 🐾'}</span>
            </button>

            {onStartChat && (
              <button
                onClick={() => {
                  onStartChat(dog);
                  onClose();
                }}
                className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition flex items-center justify-center gap-2 border border-zinc-700"
              >
                <MessageCircle className="w-4 h-4 text-zinc-400" />
                <span>Запросити на вигул у чаті</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
