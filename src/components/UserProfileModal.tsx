/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * User Profile & Pet Manager Modal
 */

import React, { useState } from 'react';
import { PetEntity, TemperamentType } from '../types/database';
import { Camera, Check, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetEntity;
  onSavePet: (updatedPet: PetEntity) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  pet,
  onSavePet,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [temperament, setTemperament] = useState<TemperamentType>(pet.temperament);
  const [avatarUrl, setAvatarUrl] = useState(pet.avatar_url);
  const [age, setAge] = useState(pet.age_years || 2);
  const [weight, setWeight] = useState(pet.weight_kg || 12);
  const [vaccinated, setVaccinated] = useState(pet.vaccinated ?? true);

  if (!isOpen) return null;

  const handleCycleAvatar = () => {
    const list = [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80',
    ];
    const next = list[(list.indexOf(avatarUrl) + 1) % list.length];
    setAvatarUrl(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePet({
      ...pet,
      name: name.trim(),
      breed: breed.trim(),
      temperament,
      avatar_url: avatarUrl,
      age_years: Number(age),
      weight_kg: Number(weight),
      vaccinated,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold"
        >
          ✕
        </button>

        <h3 className="text-xl font-black text-white">Профіль улюбленця</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Налаштування картки собаки для мапи вигулу</p>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl bg-zinc-800">
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleCycleAvatar}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition"
                title="Змінити фото"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] text-zinc-400 mt-2">Натисніть на камеру для вибору фото</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Кличка собаки</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Порода</label>
            <input
              type="text"
              required
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Temperament Selection */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Характер (колір мітки на мапі)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemperament('friendly')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  temperament === 'friendly'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                <span className="text-base">🟢</span>
                <span>Дружелюбний</span>
              </button>

              <button
                type="button"
                onClick={() => setTemperament('neutral')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  temperament === 'neutral'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                <span className="text-base">🟡</span>
                <span>Нейтральний</span>
              </button>

              <button
                type="button"
                onClick={() => setTemperament('aggressive')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  temperament === 'aggressive'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                <span className="text-base">🔴</span>
                <span>Обережно</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Вік (років)</label>
              <input
                type="number"
                step="0.5"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Вага (кг)</label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vacc-check"
              checked={vaccinated}
              onChange={(e) => setVaccinated(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-zinc-800 border-zinc-700"
            />
            <label htmlFor="vacc-check" className="text-xs text-zinc-300 flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Вакцинований від сказу та інфекцій</span>
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-950/50 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Зберегти профіль</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
