/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Application Header with City/District Selector, Language Toggle, and Push Status
 */

import React, { useState } from 'react';
import { Bell, MapPin, ChevronDown, Globe, Shield, User, HeartHandshake } from 'lucide-react';
import { CITIES, ZAPORIZHZHIA_DISTRICTS } from '../data/zaporizhzhia';
import { CityEntity, DistrictEntity, SupportedLanguage, PetEntity } from '../types/database';
import { useI18n } from '../lib/i18n/context';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentCity: CityEntity;
  onSelectCity: (city: CityEntity) => void;
  currentDistrict: DistrictEntity;
  onSelectDistrict: (district: DistrictEntity) => void;
  onOpenProfile: () => void;
  userPet: PetEntity;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  currentDistrict,
  onSelectDistrict,
  onOpenProfile,
  userPet,
}) => {
  const { language, setLanguage, t } = useI18n();
  const { isSubscribed, requestPermission } = usePushNotifications();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  return (
    <header className="relative z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & City/District Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-lg">
              🐾
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-base text-white tracking-tight">DogApp</span>
              <span className="block text-[10px] text-zinc-400 font-medium">Запоріжжя</span>
            </div>
          </div>

          {/* District Selector Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                setIsCityDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span className="max-w-[120px] sm:max-w-none truncate">
                {currentDistrict.name_json[language]}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isDistrictDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  7 Районів Запоріжжя:
                </div>
                {ZAPORIZHZHIA_DISTRICTS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDistrict(d);
                      setIsDistrictDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                      d.id === currentDistrict.id
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/80'
                    }`}
                  >
                    <span>{d.name_json[language]}</span>
                    {d.id === currentDistrict.id && <span className="text-indigo-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Language Toggle: [UA | RU] */}
          <div className="flex items-center bg-zinc-900 rounded-xl p-0.5 border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setLanguage('uk')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'uk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              UA
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'ru'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              RU
            </button>
          </div>

          {/* Push Notification Bell */}
          <button
            onClick={() => requestPermission()}
            title={isSubscribed ? t.pwa.notifications_active : t.pwa.notifications_enable}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition relative ${
              isSubscribed
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            {isSubscribed && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* User & Pet Avatar / Profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-indigo-400 bg-zinc-800 flex-shrink-0">
              <img src={userPet.avatar_url} alt={userPet.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-white max-w-[60px] truncate hidden xs:inline">
              {userPet.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
