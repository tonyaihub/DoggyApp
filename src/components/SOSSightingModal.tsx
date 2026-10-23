/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * "Я бачив цю собаку!" (I Saw This Dog) Reporting Modal with Instant GPS & Push Dispatch
 */

import React, { useState } from 'react';
import { Eye, MapPin, Camera, Send, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { SOSAlertEntity, GeoPoint } from '../types/database';
import { useI18n } from '../lib/i18n/context';

interface SOSSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  sosAlert: SOSAlertEntity | null;
  userLocation: GeoPoint;
  onSubmitSighting: (sosId: string, sighting: {
    reporter_name: string;
    reporter_phone?: string;
    comment: string;
    photo_url?: string;
    location: GeoPoint;
  }) => void;
}

export const SOSSightingModal: React.FC<SOSSightingModalProps> = ({
  isOpen,
  onClose,
  sosAlert,
  userLocation,
  onSubmitSighting,
}) => {
  const { t } = useI18n();
  const [reporterName, setReporterName] = useState('Небайдужий мешканець');
  const [reporterPhone, setReporterPhone] = useState('');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !sosAlert) return null;

  const handleSimulatedPhoto = () => {
    setPhotoUrl('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitSighting(sosAlert.id, {
      reporter_name: reporterName.trim() || 'Гість DogApp',
      reporter_phone: reporterPhone.trim() || undefined,
      comment: comment.trim(),
      photo_url: photoUrl || undefined,
      location: userLocation,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">{t.sos.sighting_success}</h3>
            <p className="text-sm text-zinc-400">
              Господар {sosAlert.owner_name} отримав сповіщення з вашою GPS-точкою та фото!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-rose-500/40 flex-shrink-0">
                <img src={sosAlert.pet_avatar} alt={sosAlert.pet_name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase mb-1">
                  SOS • {sosAlert.pet_breed}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {t.sos.sighting_modal_title} ({sosAlert.pet_name})
                </h3>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{t.sos.sighting_instruction}</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  {t.sos.sighting_comment} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Біг у бік зупинки, кульгає на задню лапу, п'є воду біля магазину..."
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Ваш контактний телефон</label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="+380..."
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Фото з місця</label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(null)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Видалити
                    </button>
                  )}
                </div>

                {photoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-28">
                    <img src={photoUrl} alt="Sighting photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSimulatedPhoto}
                    className="w-full border border-dashed border-zinc-700 rounded-xl py-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition text-xs"
                  >
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <span>Додати фото собаки</span>
                  </button>
                )}
              </div>

              <div className="rounded-xl bg-zinc-800/50 p-2.5 flex items-center gap-2 text-xs text-zinc-400">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>
                  Точка фіксації: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </span>
              </div>

              <button
                type="submit"
                disabled={!comment.trim()}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-rose-950/60 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.sos.sighting_send}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
