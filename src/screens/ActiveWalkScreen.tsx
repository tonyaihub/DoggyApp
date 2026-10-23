/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Active Walk Tracking Screen with Live GPS, Quick Hazards, Pocket Lock, and 2s Hold-to-Finish
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Unlock,
  AlertTriangle,
  Camera,
  Trash2,
  Footprints,
  Flame,
  Clock,
  Sparkles,
  Square,
  Compass,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { useWalkTracker } from '../hooks/useWalkTracker';
import { useI18n } from '../lib/i18n/context';
import { PetEntity, WalkSessionEntity, GeoPoint, WalkRoutePoint } from '../types/database';
import { realtimeGateway } from '../services/realtimeService';

interface ActiveWalkScreenProps {
  userPet: PetEntity;
  districtId: string;
  onFinishWalkSession: (session: WalkSessionEntity) => void;
  onOpenHazardModal: () => void;
  onCancelWalk: () => void;
}

export const ActiveWalkScreen: React.FC<ActiveWalkScreenProps> = ({
  userPet,
  districtId,
  onFinishWalkSession,
  onOpenHazardModal,
  onCancelWalk,
}) => {
  const { t } = useI18n();
  const [photoFlash, setPhotoFlash] = useState(false);
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  // Hold-to-finish states
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);

  const {
    isActive,
    isLocked,
    toggleLock,
    durationFormatted,
    distanceKm,
    distanceMeters,
    currentSpeedKmH,
    currentLocation,
    routePoints,
    startWalk,
    finishWalk,
    simulateStep,
  } = useWalkTracker({
    pet: userPet,
    onLocationUpdate: (pt) => {
      realtimeGateway.updateLocation({
        walk_id: `walk-active`,
        user_id: 'user-me',
        pet_name: userPet.name,
        pet_breed: userPet.breed,
        avatar_url: userPet.avatar_url,
        temperament: userPet.temperament,
        point: pt,
        district_id: districtId,
      });
    },
    onFinish: (session) => {
      realtimeGateway.endWalkSession(`walk-active`);
      onFinishWalkSession(session);
    },
  });

  // Automatically start tracking when entering this screen
  useEffect(() => {
    startWalk();
  }, []);

  const showQuickAlert = (text: string) => {
    setQuickNotice(text);
    setTimeout(() => setQuickNotice(null), 2500);
  };

  const handleDogBoxQuickMark = () => {
    showQuickAlert('💩 Дог-бокс відмічено на мапі Запоріжжя!');
  };

  const handlePhotoSnap = () => {
    setPhotoFlash(true);
    setTimeout(() => setPhotoFlash(false), 300);
    showQuickAlert('📸 Фото прогулянки збережено у спогади!');
  };

  // Hold-to-finish handling (2000ms duration)
  const handleHoldStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    holdStartRef.current = Date.now();
    setHoldProgress(0);

    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(100, (elapsed / 2000) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdTimerRef.current!);
        holdTimerRef.current = null;
        finishWalk();
      }
    }, 40);
  };

  const handleHoldEnd = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  };

  const centerPoint: GeoPoint = currentLocation
    ? { lat: currentLocation.lat, lng: currentLocation.lng }
    : { lat: 47.8432, lng: 35.1328 };

  return (
    <div className="relative w-full h-[calc(100vh-61px)] bg-zinc-950 overflow-hidden flex flex-col select-none">
      {/* Photo Flash Animation */}
      {photoFlash && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300" />}

      {/* Upper Metrics Panel */}
      <div className="relative z-20 bg-zinc-950/95 border-b border-zinc-800/90 px-4 py-3 shadow-xl backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              {t.walk.live_badge}
            </span>
            <span className="text-xs text-zinc-500 hidden sm:inline">• {userPet.name}</span>
          </div>

          {/* Quick Metrics Banner */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="text-center">
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                {t.walk.time}
              </span>
              <span className="text-base sm:text-lg font-black text-white font-mono">
                {durationFormatted}
              </span>
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                {t.walk.distance}
              </span>
              <span className="text-base sm:text-lg font-black text-indigo-400 font-mono">
                {distanceKm} <span className="text-xs font-bold text-zinc-400">км</span>
              </span>
            </div>

            <div className="text-center hidden xs:block">
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                {t.walk.speed}
              </span>
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                {currentSpeedKmH} <span className="text-xs font-bold text-zinc-400">км/г</span>
              </span>
            </div>
          </div>

          {/* Pocket Screen Lock Toggle */}
          <button
            onClick={toggleLock}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              isLocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-lg shadow-amber-950/40'
                : 'bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700'
            }`}
            title={t.walk.lock_tip}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLocked ? 'Заблоковано' : 'Блок'}</span>
          </button>
        </div>
      </div>

      {/* Screen Lock Fullscreen Overlay (Pocket Protection) */}
      {isLocked && (
        <div
          onClick={toggleLock}
          className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center cursor-pointer animate-in fade-in duration-200"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/60 text-amber-400 flex items-center justify-center mb-4 shadow-2xl shadow-amber-950/50 animate-pulse">
            <Lock className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white">{t.walk.screen_locked}</h3>
          <p className="text-xs text-zinc-400 mt-2 max-w-xs">{t.walk.lock_tip}</p>
          <div className="mt-6 px-5 py-2.5 rounded-2xl bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200">
            Натисніть у будь-якому місці для розблокування
          </div>
        </div>
      )}

      {/* Live Map with Track Polyline */}
      <div className="relative w-full flex-1">
        <LeafletMap
          center={centerPoint}
          zoom={16}
          walkingDogs={[]}
          geoNotes={[]}
          sosAlerts={[]}
          partnerPerks={[]}
          userLocation={centerPoint}
          activeRoutePoints={routePoints}
          activeFilters={{
            dogs: true,
            hazards: true,
            dogboxes: true,
            vets: true,
            parks: true,
            perks: true,
          }}
        />

        {/* Quick notification toast */}
        {quickNotice && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-zinc-900/95 border border-indigo-500 text-white font-bold text-xs shadow-2xl shadow-indigo-950/60 backdrop-blur-md animate-in slide-in-from-top-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{quickNotice}</span>
          </div>
        )}

        {/* Floating Quick Action Buttons */}
        <div className="absolute bottom-28 right-4 z-20 flex flex-col gap-2.5">
          {/* Simulation step button for desktop/demo testing */}
          <button
            onClick={simulateStep}
            className="w-11 h-11 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xl backdrop-blur-md flex items-center justify-center transition active:scale-90"
            title="Симуляція переміщення (крок)"
          >
            <Footprints className="w-5 h-5" />
          </button>

          {/* Quick Photo */}
          <button
            onClick={handlePhotoSnap}
            className="w-11 h-11 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-indigo-400 border border-zinc-700 shadow-xl backdrop-blur-md flex items-center justify-center transition active:scale-90"
            title={t.walk.take_photo}
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Quick Dog-box */}
          <button
            onClick={handleDogBoxQuickMark}
            className="w-11 h-11 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xl backdrop-blur-md flex items-center justify-center transition active:scale-90 text-base"
            title={t.walk.mark_dogbox}
          >
            💩
          </button>

          {/* Quick Hazard Marker */}
          <button
            onClick={onOpenHazardModal}
            className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white border-2 border-rose-400 shadow-2xl shadow-rose-950/60 flex items-center justify-center transition transform active:scale-90"
            title={t.walk.mark_hazard}
          >
            <AlertTriangle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Protected Finish Bar (Hold 2 seconds) */}
      <div className="relative z-20 bg-zinc-950/95 border-t border-zinc-800 px-6 py-4 backdrop-blur-md">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="text-[11px] text-zinc-400 font-semibold mb-2">
            {t.walk.hold_to_finish}
          </div>

          <div className="relative w-full">
            {/* Progress fill layer */}
            <div
              className="absolute inset-0 bg-rose-600 rounded-2xl transition-all pointer-events-none opacity-80"
              style={{ width: `${holdProgress}%` }}
            />

            <button
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              className="relative z-10 w-full py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 text-white font-black text-sm tracking-wider uppercase transition flex items-center justify-center gap-3 overflow-hidden shadow-xl"
            >
              <Square className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>
                {holdProgress > 0 ? `${Math.round(holdProgress)}% ЗАВЕРШЕННЯ...` : '⏹️ ЗАВЕРШИТИ ВИГУЛ'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
