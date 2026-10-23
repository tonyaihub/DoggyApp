/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SOS Lost Dogs Radar Screen (Tabs: Lost, Found, My + Cards + Call + Sighting + Wizard)
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  Phone,
  Eye,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { SOSAlertEntity } from '../types/database';
import { useI18n } from '../lib/i18n/context';

interface SOSScreenProps {
  alerts: SOSAlertEntity[];
  onOpenCreateWizard: () => void;
  onOpenSightingModal: (alert: SOSAlertEntity) => void;
  currentDistrictId: string;
}

export const SOSScreen: React.FC<SOSScreenProps> = ({
  alerts,
  onOpenCreateWizard,
  onOpenSightingModal,
  currentDistrictId,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'my'>('lost');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter alerts by tab and search
  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === 'lost' && !alert.is_active) return false;
    if (activeTab === 'found' && alert.is_active) return false;
    if (activeTab === 'my') {
      // User created alerts
      return alert.owner_id === 'current-user-uuid';
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.pet_name.toLowerCase().includes(q) ||
        alert.pet_breed.toLowerCase().includes(q) ||
        alert.last_seen_address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-61px)] bg-zinc-950 pb-32 px-4 pt-4 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top Header with Create Button */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">SOS Радар Запоріжжя</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Миттєве сповіщення собачників у радіусі 3 км про зниклих улюбленців
            </p>
          </div>

          <button
            onClick={onOpenCreateWizard}
            className="px-3.5 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs shadow-[0_4px_16px_rgba(255,255,255,0.2)] flex items-center gap-1.5 transition active:scale-95 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t.sos.create_alert}</span>
            <span className="xs:hidden">SOS +</span>
          </button>
        </div>

        {/* Tabs: Lost | Found | My */}
        <div className="flex bg-white/[0.03] backdrop-blur-xl p-1 rounded-full border border-white/[0.08] text-xs font-medium">
          <button
            onClick={() => setActiveTab('lost')}
            className={`flex-1 py-1.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'lost'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🚨</span>
            <span>{t.sos.tab_lost}</span>
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-1.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'found'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🟢</span>
            <span>{t.sos.tab_found}</span>
          </button>

          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-1.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'my'
                ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>📋</span>
            <span>{t.sos.tab_my}</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.sos.search_placeholder}
            className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/20 focus:border-indigo-500/50 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
        </div>

        {/* List of SOS Alerts */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 text-zinc-500 mx-auto flex items-center justify-center text-2xl">
                🐶
              </div>
              <h4 className="text-base font-bold text-zinc-300">Оголошень не знайдено</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                У цій категорії зараз немає активних оголошень для вибраних параметрів.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 rounded-3xl p-4 sm:p-5 shadow-lg backdrop-blur-xl transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Pet Photo */}
                  <div className="relative w-full sm:w-36 h-48 sm:h-36 rounded-2xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10">
                    <img
                      src={alert.pet_avatar}
                      alt={alert.pet_name}
                      className="w-full h-full object-cover"
                    />
                    {alert.reward_amount ? (
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 font-bold text-[11px] shadow-md tracking-tight">
                        ₴ {alert.reward_amount}
                      </div>
                    ) : null}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white tracking-tight">{alert.pet_name}</h3>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                alert.is_active
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {alert.is_active ? 'ПОШУК' : 'ЗНАЙДЕНО'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {alert.pet_breed} · Господар: {alert.owner_name}
                          </p>
                        </div>

                        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>3 год тому</span>
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-300/90 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{alert.last_seen_address}</span>
                      </div>

                      <p className="text-xs text-zinc-300 mt-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05] line-clamp-2 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>

                    {/* Sighting reports count */}
                    {alert.sightings.length > 0 && (
                      <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Надійшло {alert.sightings.length} повідомлень про помічену собаку!</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${alert.owner_phone}`}
                        className="flex-1 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.sos.call_owner}</span>
                      </a>

                      {alert.is_active && (
                        <button
                          onClick={() => onOpenSightingModal(alert)}
                          className="flex-1 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold shadow-[0_2px_14px_rgba(255,255,255,0.2)] flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-rose-600" />
                          <span>{t.sos.i_saw_dog}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
