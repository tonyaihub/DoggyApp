/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Hazard Detail Modal with Upvote (+12h TTL) and Clean Vote (3 clicks = delete)
 */

import React, { useState } from 'react';
import { ShieldAlert, ThumbsUp, Sparkles, Clock, Trash2, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { GeoNoteEntity } from '../types/database';
import { useI18n } from '../lib/i18n/context';

interface HazardDetailModalProps {
  note: GeoNoteEntity | null;
  onClose: () => void;
  onUpvote: (noteId: string) => void;
  onCleanVote: (noteId: string) => void;
}

export const HazardDetailModal: React.FC<HazardDetailModalProps> = ({
  note,
  onClose,
  onUpvote,
  onCleanVote,
}) => {
  const { t } = useI18n();
  const [upvoted, setUpvoted] = useState(false);
  const [cleanVoted, setCleanVoted] = useState(false);

  if (!note) return null;

  const handleUpvote = () => {
    if (upvoted) return;
    setUpvoted(true);
    onUpvote(note.id);
  };

  const handleCleanVote = () => {
    if (cleanVoted) return;
    setCleanVoted(true);
    onCleanVote(note.id);
  };

  const isHazard = note.category === 'hazard';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg ${
              isHazard ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {note.sub_category === 'poison' && '☠️'}
            {note.sub_category === 'broken_glass' && '🍷'}
            {note.sub_category === 'stray_pack' && '🐺'}
            {note.sub_category === 'dog_box' && '💩'}
            {note.sub_category === 'vet_clinic' && '🏥'}
            {note.sub_category === 'dog_park' && '🏞️'}
          </div>
          <div>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isHazard ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isHazard ? 'Небезпека' : 'Корисне місце'}
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5 tracking-tight">{note.author_name}</h3>
          </div>
        </div>

        {note.photo_url && (
          <div className="mt-3.5 rounded-2xl overflow-hidden border border-white/10 h-36">
            <img src={note.photo_url} alt="Hazard spot" className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-xs text-zinc-200 mt-3 bg-white/[0.03] p-3 rounded-2xl border border-white/[0.07] leading-relaxed">
          {note.comment}
        </p>

        {/* TTL info */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 px-1 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>До {new Date(note.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span>👍 {note.upvotes + (upvoted ? 1 : 0)}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">🧹 {note.clean_votes + (cleanVoted ? 1 : 0)}/3</span>
          </div>
        </div>

        {/* Verification Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleUpvote}
            disabled={upvoted}
            className={`py-2 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 border active:scale-95 ${
              upvoted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border-white/10'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{upvoted ? 'Підтверджено' : t.hazard.upvote}</span>
          </button>

          <button
            onClick={handleCleanVote}
            disabled={cleanVoted}
            className={`py-2 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 border active:scale-95 ${
              cleanVoted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white text-zinc-950 hover:bg-zinc-100 border-white/90 shadow-[0_2px_12px_rgba(255,255,255,0.2)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{cleanVoted ? 'Прибрано ✓' : t.hazard.clean_vote}</span>
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 text-center mt-2.5">
          {t.hazard.cleaned_notice}
        </p>
      </div>
    </div>
  );
};
