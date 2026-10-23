/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Partner Perk / Discount Modal for Zaporizhzhia Dog Community
 */

import React, { useState } from 'react';
import { Gift, Copy, Check, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { PartnerPerkEntity } from '../types/database';

interface PartnerPerkModalProps {
  perk: PartnerPerkEntity | null;
  onClose: () => void;
}

export const PartnerPerkModal: React.FC<PartnerPerkModalProps> = ({ perk, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!perk) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(perk.promo_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 mx-auto flex items-center justify-center text-3xl mb-3 shadow-xl shadow-indigo-950/40">
            🎁
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs uppercase tracking-wider">
            {perk.discount_label} ЗНИЖКА
          </span>

          <h3 className="text-xl font-bold text-white mt-2">{perk.title}</h3>
          <p className="text-xs text-indigo-400 font-semibold">{perk.business_name}</p>

          <p className="text-xs text-zinc-300 mt-3 bg-zinc-800/40 p-3 rounded-2xl border border-zinc-800 text-left leading-relaxed">
            {perk.description}
          </p>

          <div className="mt-3 text-left space-y-1.5 text-xs text-zinc-400 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{perk.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Дійсно до: {perk.valid_until}</span>
            </div>
          </div>

          {/* Promo code block */}
          <div className="mt-4 p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Промокод</span>
              <span className="text-sm font-mono font-black text-amber-300 tracking-wider">{perk.promo_code}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопійовано' : 'Копіювати'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
