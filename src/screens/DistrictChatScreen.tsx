/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Real-time District Chat for Zaporizhzhia Dog Owners
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
    <div className="w-full h-[calc(100vh-61px)] bg-zinc-950 flex flex-col pb-20">
      {/* Chat Header */}
      <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {t.chat.title} • {currentDistrict.name_json[language]}
            </h2>
            <p className="text-[11px] text-zinc-400">
              Спільнота собачників району Запоріжжя
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Онлайн</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs max-w-xs mx-auto">
            {t.chat.empty}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-2xl max-w-xl transition ${
                msg.is_emergency
                  ? 'bg-rose-950/40 border border-rose-500/50 shadow-lg shadow-rose-950/50'
                  : 'bg-zinc-900 border border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                    🐾
                  </div>
                  <span className="text-xs font-bold text-white">{msg.author_name}</span>
                  {msg.pet_name && (
                    <span className="text-[10px] text-indigo-400 font-medium bg-zinc-800 px-2 py-0.5 rounded-full">
                      {msg.pet_name}
                    </span>
                  )}
                  {msg.is_emergency && (
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider animate-pulse">
                      SOS УВАГА
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed pl-8">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-2">
          {/* Emergency Warning Toggle */}
          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => setIsEmergencyFlag(!isEmergencyFlag)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition ${
                isEmergencyFlag
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Термінове попередження про небезпеку</span>
            </button>
            <span className="text-[10px] text-zinc-500">Від імені: {userPet.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chat.placeholder}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center transition shadow-lg shadow-indigo-950/50 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
