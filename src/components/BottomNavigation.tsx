/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Web 3.0 Floating Glass Bottom Navigation Bar
 */

import React from 'react';
import { Map, MessageSquare, ShieldAlert, Newspaper } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

export type ActiveNavTab = 'map' | 'chat' | 'sos' | 'news';

interface BottomNavigationProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  activeSOSCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  activeSOSCount = 0,
}) => {
  const { t } = useI18n();

  const navItems: Array<{
    id: ActiveNavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    color?: string;
  }> = [
    {
      id: 'map',
      label: t.nav.map,
      icon: <Map className="w-4 h-4" />,
    },
    {
      id: 'chat',
      label: t.nav.chat,
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'sos',
      label: t.nav.sos,
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: activeSOSCount,
      color: 'rose',
    },
    {
      id: 'news',
      label: t.nav.news,
      icon: <Newspaper className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed bottom-3.5 left-0 right-0 z-30 px-4 pointer-events-none select-none">
      <nav className="max-w-md mx-auto pointer-events-auto bg-zinc-950/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_24px_rgba(99,102,241,0.08)] rounded-2xl p-1.5 flex items-center justify-between gap-1 transition-all">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex-1 py-2 px-1 rounded-xl transition-all duration-200 flex flex-col items-center gap-1 group ${
                isActive
                  ? item.color === 'rose'
                    ? 'text-rose-400 bg-rose-500/[0.08] border border-rose-500/20 shadow-sm'
                    : 'text-white bg-white/[0.08] border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-[9px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
