/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Web 3.0 District Chat for Zaporizhzhia Dog Owners
 */

import React, { useState } from 'react';
import { Send, MessageSquare, AlertCircle, ShieldAlert, Dog, Sparkles } from 'lucide-react';
import { DistrictChatMessage, DistrictEntity, PetEntity } from '../types/database';
import { useI18n } from '../lib/i18n/context';

interface DistrictChatScreenProps {
  currentDistrict: DistrictEntity;
  messages: DistrictChatMessage[];
  onSendMessage: (text: string, isEmergency?: boolean) => void;
  userPet: PetEntity;
}

export const DistrictChatScreen: React.FC<DistrictChatScreenProps> = ({
  currentDistrict,
  messages,
  onSendMessage,
  userPet,
}) => {
  const { t, language } = useI18n();
  const [inputText, setInputText] = useState('');
  const [isEmergencyFlag, setIsEmergencyFlag] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), isEmergencyFlag);
    setInputText('');
    setIsEmergencyFlag(false);
  };

  return (
    <div className="w-full h-[calc(100vh-61px)] bg-zinc-950 flex flex-col pb-24">
      {/* Chat Header */}
      <div className="p-3.5 bg-zinc-950/75 backdrop-blur-2xl border-b border-white/[0.07] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {t.chat.title} · {currentDistrict.name_json[language]}
            </h2>
            <p className="text-[10px] text-zinc-400">
              Спільнота собачників району Запоріжжя
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span>Онлайн</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs max-w-xs mx-auto">
            {t.chat.empty}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-2xl max-w-xl transition-all ${
                msg.is_emergency
                  ? 'bg-rose-950/30 border border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.15)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs">🐾</span>
                  <span className="text-xs font-semibold text-white tracking-tight">{msg.author_name}</span>
                  {msg.pet_name && (
                    <span className="text-[10px] text-zinc-400 font-normal">
                      · {msg.pet_name}
                    </span>
                  )}
                  {msg.is_emergency && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold text-[9px] uppercase shadow-[0_0_8px_#f43f5e]">
                      SOS УВАГА
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed pl-5 font-normal">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/[0.08]">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-2">
          {/* Emergency Warning Toggle */}
          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => setIsEmergencyFlag(!isEmergencyFlag)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium transition-all ${
                isEmergencyFlag
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Попередити про небезпеку</span>
            </button>
            <span className="text-[10px] text-zinc-500">Від: {userPet.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chat.placeholder}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500/50 rounded-full px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-white hover:bg-zinc-100 disabled:opacity-40 text-zinc-950 flex items-center justify-center transition shadow-[0_2px_12px_rgba(255,255,255,0.2)] flex-shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-zinc-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
