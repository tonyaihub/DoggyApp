/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile-First Bottom Navigation Bar (Map, District Chat, SOS Radar, News)
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2 select-none">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {/* Map Tab */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
            activeTab === 'map' ? 'text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition ${
              activeTab === 'map' ? 'bg-indigo-600/20 text-indigo-400' : ''
            }`}
          >
            <Map className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.nav.map}</span>
        </button>

        {/* District Chat Tab */}
        <button
          onClick={() => onSelectTab('chat')}
          className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
            activeTab === 'chat' ? 'text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition ${
              activeTab === 'chat' ? 'bg-indigo-600/20 text-indigo-400' : ''
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.nav.chat}</span>
        </button>

        {/* SOS Alerts Tab (With pulse badge if active) */}
        <button
          onClick={() => onSelectTab('sos')}
          className={`flex-1 py-1 flex flex-col items-center gap-1 transition relative ${
            activeTab === 'sos' ? 'text-rose-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition relative ${
              activeTab === 'sos' ? 'bg-rose-600/20 text-rose-400' : ''
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            {activeSOSCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-[9px] font-black text-white animate-pulse">
                {activeSOSCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{t.nav.sos}</span>
        </button>

        {/* News Tab */}
        <button
          onClick={() => onSelectTab('news')}
          className={`flex-1 py-1 flex flex-col items-center gap-1 transition ${
            activeTab === 'news' ? 'text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition ${
              activeTab === 'news' ? 'bg-indigo-600/20 text-indigo-400' : ''
            }`}
          >
            <Newspaper className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">{t.nav.news}</span>
        </button>
      </div>
    </nav>
  );
};
