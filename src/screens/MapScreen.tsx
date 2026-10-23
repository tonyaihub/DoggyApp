/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Main Map Screen with Leaflet, Walking Dogs, POIs, Bottom Sheet, and Start Walk FAB
 */

import React, { useState } from 'react';
import { LeafletMap } from '../components/LeafletMap';
import { LiveWalkingDog } from '../data/zaporizhzhia';
import {
  GeoPoint,
  GeoNoteEntity,
  SOSAlertEntity,
  PartnerPerkEntity,
  DistrictEntity,
} from '../types/database';
import { useI18n } from '../lib/i18n/context';
import {
  Navigation,
  Filter,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Gift,
  AlertTriangle,
  Dog,
  Clock,
  Compass,
  Tag,
  Footprints,
} from 'lucide-react';

interface MapScreenProps {
  currentDistrict: DistrictEntity;
  walkingDogs: LiveWalkingDog[];
  geoNotes: GeoNoteEntity[];
  sosAlerts: SOSAlertEntity[];
  partnerPerks: PartnerPerkEntity[];
  userLocation: GeoPoint;
  onSelectDog: (dog: LiveWalkingDog) => void;
  onSelectHazard: (note: GeoNoteEntity) => void;
  onSelectSOS: (sos: SOSAlertEntity) => void;
  onSelectPerk: (perk: PartnerPerkEntity) => void;
  onStartWalk: () => void;
  onOpenHazardModal: () => void;
}

import { MapTileType } from '../components/LeafletMap';
import { Layers } from 'lucide-react';

export const MapScreen: React.FC<MapScreenProps> = ({
  currentDistrict,
  walkingDogs,
  geoNotes,
  sosAlerts,
  partnerPerks,
  userLocation,
  onSelectDog,
  onSelectHazard,
  onSelectSOS,
  onSelectPerk,
  onStartWalk,
  onOpenHazardModal,
}) => {
  const { t } = useI18n();
  const [mapCenter, setMapCenter] = useState<GeoPoint>(currentDistrict.center);
  const [zoom, setZoom] = useState(14);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [mapType, setMapType] = useState<MapTileType>('hybrid');
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);

  const [filters, setFilters] = useState({
    dogs: true,
    hazards: true,
    dogboxes: true,
    vets: true,
    parks: true,
    perks: true,
  });

  const handleCenterOnUser = () => {
    setMapCenter(userLocation);
    setZoom(15);
  };

  const districtDogs = walkingDogs.filter((d) => d.district_id === currentDistrict.id);
  const activePartner = partnerPerks[0];

  return (
    <div className="relative w-full h-[calc(100vh-61px)] overflow-hidden bg-zinc-950 flex flex-col">
      {/* Interactive Map */}
      <div className="relative w-full flex-1">
        <LeafletMap
          center={mapCenter}
          zoom={zoom}
          walkingDogs={walkingDogs}
          geoNotes={geoNotes}
          sosAlerts={sosAlerts}
          partnerPerks={partnerPerks}
          userLocation={userLocation}
          mapType={mapType}
          onMapTypeChange={setMapType}
          activeFilters={filters}
          onSelectDog={onSelectDog}
          onSelectHazard={onSelectHazard}
          onSelectSOS={onSelectSOS}
          onSelectPerk={onSelectPerk}
        />

        {/* Floating Top-Right Map Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5">
          {/* Google Maps Layer Switcher */}
          <button
            onClick={() => {
              setIsLayerMenuOpen(!isLayerMenuOpen);
              setIsFilterOpen(false);
            }}
            className={`w-11 h-11 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-center transition transform active:scale-95 ${
              mapType.includes('satellite') || mapType === 'hybrid'
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white border-zinc-800 hover:bg-zinc-800'
            }`}
            title="Google Maps Супутник / Шари карти"
          >
            <Layers className="w-5 h-5" />
          </button>

          {/* My Location button */}
          <button
            onClick={handleCenterOnUser}
            className="w-11 h-11 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-indigo-400 border border-zinc-800 shadow-xl backdrop-blur-md flex items-center justify-center transition transform active:scale-95"
            title={t.map.my_location}
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Filter button */}
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsLayerMenuOpen(false);
            }}
            className={`w-11 h-11 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-center transition transform active:scale-95 ${
              isFilterOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white border-zinc-800 hover:bg-zinc-800'
            }`}
            title="Фільтр міток"
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Quick Hazard Report from Map */}
          <button
            onClick={onOpenHazardModal}
            className="w-11 h-11 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-400 shadow-xl shadow-rose-950/60 backdrop-blur-md flex items-center justify-center transition transform active:scale-95"
            title="Швидка відмітка небезпеки"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Google Maps Layer Switcher Popover */}
        {isLayerMenuOpen && (
          <div className="absolute top-16 right-4 z-30 w-64 bg-zinc-900/95 border border-zinc-800 rounded-2xl p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Режим Google Maps:
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setMapType('hybrid');
                  setIsLayerMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                  mapType === 'hybrid'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🛰️</span>
                  <span>Google Супутник (Гібрид)</span>
                </div>
                {mapType === 'hybrid' && <span>✓</span>}
              </button>

              <button
                onClick={() => {
                  setMapType('satellite');
                  setIsLayerMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                  mapType === 'satellite'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🛰️</span>
                  <span>Google Супутник (Фото)</span>
                </div>
                {mapType === 'satellite' && <span>✓</span>}
              </button>

              <button
                onClick={() => {
                  setMapType('roadmap');
                  setIsLayerMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                  mapType === 'roadmap'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🗺️</span>
                  <span>Google Схема доріг</span>
                </div>
                {mapType === 'roadmap' && <span>✓</span>}
              </button>

              <button
                onClick={() => {
                  setMapType('dark');
                  setIsLayerMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                  mapType === 'dark'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🌃</span>
                  <span>Темна нічна карта</span>
                </div>
                {mapType === 'dark' && <span>✓</span>}
              </button>
            </div>
          </div>
        )}

        {/* Floating Filter Menu Popover */}
        {isFilterOpen && (
          <div className="absolute top-16 right-4 z-30 w-56 bg-zinc-900/95 border border-zinc-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              {t.map.filter_all}
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>🐕</span> {t.map.filter_dogs}
                </span>
                <input
                  type="checkbox"
                  checked={filters.dogs}
                  onChange={(e) => setFilters({ ...filters, dogs: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>⚠️</span> {t.map.filter_hazards}
                </span>
                <input
                  type="checkbox"
                  checked={filters.hazards}
                  onChange={(e) => setFilters({ ...filters, hazards: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>💩</span> {t.map.filter_dogboxes}
                </span>
                <input
                  type="checkbox"
                  checked={filters.dogboxes}
                  onChange={(e) => setFilters({ ...filters, dogboxes: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>🏥</span> {t.map.filter_vets}
                </span>
                <input
                  type="checkbox"
                  checked={filters.vets}
                  onChange={(e) => setFilters({ ...filters, vets: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>🏞️</span> {t.map.filter_parks}
                </span>
                <input
                  type="checkbox"
                  checked={filters.parks}
                  onChange={(e) => setFilters({ ...filters, parks: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>🎁</span> {t.map.filter_perks}
                </span>
                <input
                  type="checkbox"
                  checked={filters.perks}
                  onChange={(e) => setFilters({ ...filters, perks: e.target.checked })}
                  className="rounded text-indigo-600"
                />
              </label>
            </div>
          </div>
        )}

        {/* Legend pill at bottom-left of map */}
        <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-300 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{t.map.friendly}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{t.map.neutral}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>{t.map.cautious}</span>
          </div>
        </div>

        {/* Central Prominent FAB: [ 🐾 ПОЧАТИ ВИГУЛ ] */}
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            onClick={onStartWalk}
            className="group relative px-7 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm tracking-wider uppercase shadow-2xl shadow-indigo-600/60 border-2 border-indigo-400/50 flex items-center gap-3 transition transform active:scale-95 hover:scale-105"
          >
            <span className="absolute -inset-1 rounded-full bg-indigo-500 animate-pulse opacity-40 blur-sm pointer-events-none" />
            <span className="text-xl group-hover:rotate-12 transition-transform">🐾</span>
            <span className="relative z-10">{t.nav.start_walk}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet: Nearby Dogs & Partner Card */}
      <div
        className={`relative z-20 bg-zinc-900 border-t border-zinc-800/90 rounded-t-3xl shadow-2xl transition-all duration-300 ${
          isBottomSheetExpanded ? 'h-72 sm:h-80' : 'h-24 sm:h-28'
        }`}
      >
        {/* Drag Handle & Header */}
        <div
          onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
          className="w-full pt-2.5 pb-2 px-4 cursor-pointer flex flex-col items-center select-none"
        >
          <div className="w-12 h-1 rounded-full bg-zinc-700/80 mb-2" />
          <div className="w-full flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Dog className="w-4 h-4 text-indigo-400" />
                {t.map.nearby_dogs_title} ({districtDogs.length})
              </span>
              <span className="text-[11px] text-zinc-400 hidden xs:inline">
                • {currentDistrict.name_json.uk}
              </span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 text-xs">
              <span>{isBottomSheetExpanded ? 'Згорнути' : 'Більше'}</span>
              {isBottomSheetExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Horizontal or Vertical scroll of dogs */}
        <div className="px-4 pb-4 overflow-y-auto h-[calc(100%-48px)] space-y-2.5">
          {/* Nearby Dogs Cards */}
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {districtDogs.map((dog) => (
              <div
                key={dog.id}
                onClick={() => onSelectDog(dog)}
                className="flex-shrink-0 w-60 bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 rounded-2xl p-2.5 cursor-pointer transition flex items-center gap-2.5 shadow-sm"
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500 bg-zinc-900 flex-shrink-0">
                    <img src={dog.pet.avatar_url} alt={dog.pet.name} className="w-full h-full object-cover" />
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                      dog.pet.temperament === 'friendly'
                        ? 'bg-emerald-500'
                        : dog.pet.temperament === 'neutral'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white truncate">{dog.pet.name}</h5>
                    <span className="text-[10px] text-indigo-400 font-semibold">{dog.walk_duration_mins} хв</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">{dog.pet.breed}</p>
                  <p className="text-[10px] text-zinc-500">Пройдено: {dog.distance_walked_km} км</p>
                </div>
              </div>
            ))}
          </div>

          {/* Native Partner Perk Card */}
          {activePartner && (
            <div
              onClick={() => onSelectPerk(activePartner)}
              className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-zinc-900 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-500/60 transition shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
                  🎁
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-indigo-600/40 text-indigo-300 border border-indigo-500/30">
                      {t.map.partner_card_badge}
                    </span>
                    <span className="text-xs font-bold text-amber-300">{activePartner.discount_label}</span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-0.5">{activePartner.title}</p>
                  <p className="text-[10px] text-zinc-400">{activePartner.business_name} • {activePartner.address}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-md transition flex-shrink-0">
                {t.map.partner_get_discount}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
