/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 3-Step Rapid SOS Alert Creation Wizard
 */

import React, { useState } from 'react';
import { Camera, MapPin, Phone, Award, ShieldAlert, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { SOSAlertEntity, GeoPoint } from '../types/database';
import { ZAPORIZHZHIA_DISTRICTS } from '../data/zaporizhzhia';
import { useI18n } from '../lib/i18n/context';

interface SOSCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDistrictId: string;
  defaultLocation: GeoPoint;
  onPublish: (newAlert: Omit<SOSAlertEntity, 'id' | 'created_at' | 'sightings'>) => void;
}

export const SOSCreateModal: React.FC<SOSCreateModalProps> = ({
  isOpen,
  onClose,
  defaultDistrictId,
  defaultLocation,
  onPublish,
}) => {
  const { t, language } = useI18n();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Pet info
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80');

  // Step 2: Location
  const [districtId, setDistrictId] = useState(defaultDistrictId);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<GeoPoint>(defaultLocation);

  // Step 3: Contacts & Reward
  const [ownerName, setOwnerName] = useState('Власник');
  const [ownerPhone, setOwnerPhone] = useState('+380');
  const [rewardAmount, setRewardAmount] = useState<number>(3000);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && (!petName.trim() || !petBreed.trim())) return;
    if (step === 2 && !address.trim()) return;
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish({
      pet_id: `pet-sos-${Date.now()}`,
      pet_name: petName.trim(),
      pet_breed: petBreed.trim(),
      pet_avatar: avatarUrl,
      owner_id: 'current-user-uuid',
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim(),
      district_id: districtId,
      last_seen_location: location,
      last_seen_address: address.trim(),
      reward_amount: Number(rewardAmount) || 0,
      description: description.trim(),
      is_active: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        {/* Wizard Header & Progress */}
        <div className="pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>SOS-Радар Запоріжжя</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{t.sos.create_alert}</h3>

          {/* Stepper Dots */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-white/10'}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* STEP 1: PET INFO */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{t.sos.step1_title}</h4>

              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-500/50 bg-zinc-900 ring-4 ring-rose-500/20 flex-shrink-0">
                  <img src={avatarUrl} alt="Pet" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-zinc-400 block mb-1">Фото улюбленця</label>
                  <button
                    type="button"
                    onClick={() => {
                      const demoAvatars = [
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
                        'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=500&q=80',
                        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=500&q=80',
                        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80',
                      ];
                      const next = demoAvatars[(demoAvatars.indexOf(avatarUrl) + 1) % demoAvatars.length];
                      setAvatarUrl(next);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs text-zinc-200 border border-white/10 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                    <span>Змінити фото</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">{t.sos.pet_name} *</label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Наприклад: Арчі, Бадді, Джессі..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">{t.sos.pet_breed} *</label>
                <input
                  type="text"
                  required
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  placeholder="Вівчарка, Спанієль, Лабрадор, Без породи..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition"
                />
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{t.sos.step2_title}</h4>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">{t.sos.select_district} *</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition"
                >
                  {ZAPORIZHZHIA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-zinc-900 text-white">
                      {d.name_json[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">{t.sos.address_landmark} *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Парк Трудової Слави, пр. Соборний 150, біля Сільпо..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition"
                />
              </div>

              <div className="rounded-2xl bg-white/[0.03] p-3 border border-white/[0.07] flex items-center gap-2.5 text-xs text-zinc-300">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="font-mono text-[11px]">
                  Точка на карті: ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACTS & REWARD */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{t.sos.step3_title}</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Ваше ім'я</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">{t.sos.owner_phone} *</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">{t.sos.reward_amount}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="500"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none transition pr-12 font-mono"
                  />
                  <span className="absolute right-3.5 top-2 text-xs font-bold text-amber-400">₴ UAH</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">{t.sos.description}</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Особливі прикмети: шрам на носі, коричневий нашийник, боїться гучних звуків..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-rose-500/50 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-300">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Миттєвий push-радар буде надіслано всім власникам собак у радіусі 3 км!</span>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-semibold hover:bg-white/[0.1] flex items-center gap-1.5 transition active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Назад
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={(step === 1 && (!petName.trim() || !petBreed.trim())) || (step === 2 && !address.trim())}
                className="px-5 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(255,255,255,0.2)] transition active:scale-95"
              >
                Далі <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition active:scale-95"
              >
                <Check className="w-3.5 h-3.5 text-zinc-950" /> {t.sos.publish_sos}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
