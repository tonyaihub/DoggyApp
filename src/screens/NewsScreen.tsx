/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Web 3.0 News & Dog Care Community Feed for Zaporizhzhia
 */

import React from 'react';
import { Newspaper, Calendar, BookOpen } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  summary: string;
  readTime: string;
}

const ZAPORIZHZHIA_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'У Запоріжжі встановили 25 нових дог-боксів у парках Трудової Слави та Дубовий Гай',
    category: 'Місто & Екологія',
    date: '20 Жовтня 2026',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    summary: 'Комунальні служби міста за підтримки волонтерів поповнили запаси біорозкладних пакетів. Прибирання за чотирилапими робить парки безпечними для дітей і тварин.',
    readTime: '3 хв',
  },
  {
    id: 'news-2',
    title: 'Безкоштовна вакцинація від сказу в державних ветлікарнях Запоріжжя',
    category: 'Здоров\'я улюбленців',
    date: '18 Жовтня 2026',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    summary: 'Державна служба ветеринарної медицини проводить щорічну планову кампанію щеплення собак та котів у Вознесенському, Дніпровському та Комунарському районах.',
    readTime: '2 хв',
  },
  {
    id: 'news-3',
    title: 'Топ-7 dog-friendly кав\'ярень на проспекті Соборному',
    category: 'Лайфстайл',
    date: '15 Жовтня 2026',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
    summary: 'Де в Запоріжжі вас радо зустрінуть із собакою будь-якого розміру, пригостять смаколиком та наллють миску свіжої води.',
    readTime: '4 хв',
  },
  {
    id: 'news-4',
    title: 'Правила безпечного вечірнього вигулу: світловідбивні елементи та нашийники',
    category: 'Поради експертів',
    date: '10 Жовтня 2026',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    summary: 'Як захистити собаку в темний час доби на неосвітлених алеях та попередити раптові небезпеки.',
    readTime: '3 хв',
  },
];

export const NewsScreen: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="w-full min-h-[calc(100vh-61px)] bg-zinc-950 pb-32 px-4 pt-4 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-indigo-400 flex items-center justify-center">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">{t.news.title}</h2>
            <p className="text-[11px] text-zinc-400">
              Актуальні події, дог-гігієна та безпека собак у Запоріжжі
            </p>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ZAPORIZHZHIA_NEWS.map((item) => (
            <article
              key={item.id}
              className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 rounded-3xl overflow-hidden backdrop-blur-xl transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="relative h-40 w-full bg-zinc-900 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-indigo-300 font-medium text-[10px] uppercase border border-white/10">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {item.date}
                    </span>
                    <span>· {item.readTime} читання</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-normal">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => alert(`Стаття: "${item.title}" збережена у закладки!`)}
                  className="w-full py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/10 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.news.read_more}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
