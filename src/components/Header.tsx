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
    <header className="relative z-30 bg-zinc-950/70 backdrop-blur-2xl border-b border-white/[0.07] px-4 py-2.5 select-none transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & City/District Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-transform duration-200 group-hover:scale-105">
              <div className="w-full h-full rounded-[11px] bg-zinc-950/90 flex items-center justify-center text-sm">
                🐾
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                DogApp
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-white/[0.08] text-zinc-300 border border-white/10">
                  ZP
                </span>
              </span>
            </div>
          </div>

          {/* District Selector Capsule */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                setIsCityDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs font-medium text-zinc-200 transition-all backdrop-blur-md"
            >
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span className="max-w-[120px] sm:max-w-none truncate font-medium">
                {currentDistrict.name_json[language]}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isDistrictDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.7)] z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Райони Запоріжжя
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
                        ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                        : 'text-zinc-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{d.name_json[language]}</span>
                    {d.id === currentDistrict.id && <span className="text-indigo-400 font-bold">✓</span>}
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
          <div className="flex items-center bg-white/[0.04] backdrop-blur-md rounded-full p-0.5 border border-white/[0.08] text-[11px] font-semibold">
            <button
              onClick={() => setLanguage('uk')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'uk'
                  ? 'bg-white text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              UA
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === 'ru'
                  ? 'bg-white text-zinc-950 font-bold shadow-sm'
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
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all relative ${
              isSubscribed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {isSubscribed && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            )}
          </button>

          {/* User & Pet Avatar / Profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 pl-0.5 pr-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] transition-all"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-zinc-800 flex-shrink-0">
              <img src={userPet.avatar_url} alt={userPet.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-medium text-zinc-200 max-w-[60px] truncate hidden xs:inline">
              {userPet.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
