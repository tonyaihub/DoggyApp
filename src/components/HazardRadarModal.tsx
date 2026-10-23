/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Rapid Hazard Radar Modal (10-second hazard report + TTL + Push)
 */

import React, { useState } from 'react';
import { AlertTriangle, Camera, ShieldAlert, Dog, Trash2, MapPin, CheckCircle, Clock } from 'lucide-react';
import { GeoNoteCategory, HazardSubCategory, GeoPoint } from '../types/database';
import { useI18n } from '../lib/i18n/context';

interface HazardRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: GeoPoint;
  districtId: string;
  onPublish: (hazard: {
    category: GeoNoteCategory;
    sub_category: HazardSubCategory;
    comment: string;
    photo_url?: string;
    location: GeoPoint;
    district_id: string;
  }) => void;
}

export const HazardRadarModal: React.FC<HazardRadarModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  districtId,
  onPublish,
}) => {
  const { t } = useI18n();
  const [category, setCategory] = useState<GeoNoteCategory>('hazard');
  const [subCategory, setSubCategory] = useState<HazardSubCategory>('poison');
  const [comment, setComment] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedPhoto = () => {
    // Provide realistic photo depending on chosen subCategory
    if (subCategory === 'poison') {
      setPhotoPreview('https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=600&q=80');
    } else if (subCategory === 'broken_glass') {
      setPhotoPreview('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80');
    } else if (subCategory === 'stray_pack') {
      setPhotoPreview('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80');
    } else {
      setPhotoPreview('https://images.unsplash.com/photo-1563889958769-acf246964177?auto=format&fit=crop&w=600&q=80');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onPublish({
        category,
        sub_category: subCategory,
        comment: comment.trim(),
        photo_url: photoPreview || undefined,
        location: userLocation,
        district_id: districtId,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.hazard.title}</h3>
              <p className="text-xs text-zinc-400">{t.hazard.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Main Category */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">{t.hazard.category}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('hazard');
                  setSubCategory('poison');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  category === 'hazard'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-950/40'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Опасность</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('stray_dog');
                  setSubCategory('stray_pack');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  category === 'stray_dog'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-950/40'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <Dog className="w-4 h-4 text-orange-400" />
                <span>Зграя / Бездомні</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('useful_spot');
                  setSubCategory('dog_box');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  category === 'useful_spot'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                    : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Корисне</span>
              </button>
            </div>
          </div>

          {/* Subcategory selectors */}
          {category === 'hazard' && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSubCategory('poison')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  subCategory === 'poison'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                ☠️ {t.hazard.poison}
              </button>
              <button
                type="button"
                onClick={() => setSubCategory('broken_glass')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  subCategory === 'broken_glass'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                🍷 {t.hazard.glass}
              </button>
              <button
                type="button"
                onClick={() => setSubCategory('open_manhole')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  subCategory === 'open_manhole'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                🕳️ {t.hazard.manhole}
              </button>
            </div>
          )}

          {category === 'useful_spot' && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSubCategory('dog_box')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  subCategory === 'dog_box'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                💩 Дог-бокс
              </button>
              <button
                type="button"
                onClick={() => setSubCategory('vet_clinic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  subCategory === 'vet_clinic'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                🏥 Ветклініка
              </button>
              <button
                type="button"
                onClick={() => setSubCategory('dog_park')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  subCategory === 'dog_park'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                🏞️ Майданчик
              </button>
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">{t.hazard.comment}</label>
            <textarea
              required
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишіть орієнтир: біля кущів, лавочки, номер будинку..."
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Photo attachment simulation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">Фото з місця</label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Видалити фото
                </button>
              )}
            </div>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-32">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulatedPhoto}
                className="w-full border-2 border-dashed border-zinc-700 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition"
              >
                <Camera className="w-5 h-5 text-indigo-400" />
                <span className="text-xs">Сфотографувати або завантажити</span>
              </button>
            )}
          </div>

          {/* Dynamic TTL Indicator */}
          <div className="rounded-xl bg-zinc-800/60 p-3 border border-zinc-700/60 flex items-center gap-3 text-xs text-zinc-400">
            <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div>
              <span className="text-zinc-300 font-medium">Час життя мітки (TTL): </span>
              {category === 'hazard'
                ? t.hazard.ttl_hazard_info
                : category === 'stray_dog'
                ? t.hazard.ttl_stray_info
                : 'Постійна мітка (оновлюється раз на місяць)'}
            </div>
          </div>

          {/* GPS Coordinates preview */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              GPS: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)} (Запоріжжя)
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-rose-950/50 transition flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSubmitting ? 'Публікація...' : t.hazard.publish}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
