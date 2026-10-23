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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-2xl mb-3 shadow-lg">
            🎁
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-[10px] uppercase tracking-wider">
            {perk.discount_label} ЗНИЖКА
          </span>

          <h3 className="text-lg font-bold text-white mt-2 tracking-tight">{perk.title}</h3>
          <p className="text-xs text-indigo-400 font-semibold">{perk.business_name}</p>

          <p className="text-xs text-zinc-300 mt-3 bg-white/[0.03] p-3 rounded-2xl border border-white/[0.07] text-left leading-relaxed">
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
          <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="block text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold">Промокод</span>
              <span className="text-sm font-mono font-black text-amber-300 tracking-wider">{perk.promo_code}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold transition flex items-center gap-1.5 shadow-[0_2px_12px_rgba(255,255,255,0.2)] active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопійовано' : 'Копіювати'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
