/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Geodata, Administrative Districts, and Seeding for Zaporizhzhia, Ukraine
 */

import {
  CityEntity,
  DistrictEntity,
  PetEntity,
  GeoNoteEntity,
  SOSAlertEntity,
  PartnerPerkEntity,
  DistrictChatMessage,
} from '../types/database';

export const CITIES: CityEntity[] = [
  {
    id: 'zaporizhzhia',
    country_code: 'UA',
    name_json: {
      uk: 'Запоріжжя',
      ru: 'Запорожье',
    },
    center: { lat: 47.8388, lng: 35.1396 },
    default_zoom: 13,
  },
  {
    id: 'dnipro',
    country_code: 'UA',
    name_json: {
      uk: 'Дніпро',
      ru: 'Днепр',
    },
    center: { lat: 48.4647, lng: 35.0462 },
    default_zoom: 13,
  },
  {
    id: 'kyiv',
    country_code: 'UA',
    name_json: {
      uk: 'Київ',
      ru: 'Киев',
    },
    center: { lat: 50.4501, lng: 30.5234 },
    default_zoom: 13,
  },
  {
    id: 'lviv',
    country_code: 'UA',
    name_json: {
      uk: 'Львів',
      ru: 'Львов',
    },
    center: { lat: 49.8397, lng: 24.0297 },
    default_zoom: 13,
  },
];

export const ZAPORIZHZHIA_DISTRICTS: DistrictEntity[] = [
  {
    id: 'voznesenivskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Вознесенський район',
      ru: 'Вознесеновский район',
    },
    center: { lat: 47.8432, lng: 35.1328 }, // Bulvar Shevchenka / Mayakovsky
  },
  {
    id: 'dniprovskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Дніпровський район',
      ru: 'Днепровский район',
    },
    center: { lat: 47.8680, lng: 35.0935 }, // DniproHES / Metallurg / Right bank
  },
  {
    id: 'komunarskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Комунарський район',
      ru: 'Коммунарский район',
    },
    center: { lat: 47.7850, lng: 35.1830 }, // Dubovyi Hai / Kosmichnyi
  },
  {
    id: 'oleksandrivskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Олександрівський район',
      ru: 'Александровский район',
    },
    center: { lat: 47.8220, lng: 35.1740 }, // Sobornyi ave / Old town / ZNU
  },
  {
    id: 'khortytskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Хортицький район (Бабурка)',
      ru: 'Хортицкий район (Бабурка)',
    },
    center: { lat: 47.8285, lng: 35.0440 }, // Khortytsia / Baburka
  },
  {
    id: 'zavodskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Заводський район (Павло-Кічкас)',
      ru: 'Заводский район (Павло-Кичкас)',
    },
    center: { lat: 47.8870, lng: 35.1620 }, // Pavlo-Kichkas
  },
  {
    id: 'shevchenkivskyi',
    city_id: 'zaporizhzhia',
    name_json: {
      uk: 'Шевченківський район',
      ru: 'Шевченковский район',
    },
    center: { lat: 47.8340, lng: 35.2150 }, // Motor Sich / Park Klymov
  },
];

export interface LiveWalkingDog {
  id: string;
  user_id: string;
  owner_name: string;
  pet: PetEntity;
  location: { lat: number; lng: number };
  heading: number;
  walk_duration_mins: number;
  distance_walked_km: number;
  district_id: string;
}

export const INITIAL_WALKING_DOGS: LiveWalkingDog[] = [
  {
    id: 'walk-1',
    user_id: 'usr-1',
    owner_name: 'Олена М.',
    pet: {
      id: 'pet-1',
      owner_id: 'usr-1',
      name: 'Бадді',
      breed: 'Золотистий ретривер',
      age_years: 3,
      temperament: 'friendly',
      avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
      vaccinated: true,
    },
    location: { lat: 47.8455, lng: 35.1315 }, // Near Bulvar Shevchenka
    heading: 45,
    walk_duration_mins: 24,
    distance_walked_km: 1.8,
    district_id: 'voznesenivskyi',
  },
  {
    id: 'walk-2',
    user_id: 'usr-2',
    owner_name: 'Андрій К.',
    pet: {
      id: 'pet-2',
      owner_id: 'usr-2',
      name: 'Шелбі',
      breed: 'Вельш-коргі пемброк',
      age_years: 2,
      temperament: 'friendly',
      avatar_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80',
      vaccinated: true,
    },
    location: { lat: 47.8415, lng: 35.1385 }, // Near Mayakovsky square
    heading: 120,
    walk_duration_mins: 15,
    distance_walked_km: 0.9,
    district_id: 'voznesenivskyi',
  },
  {
    id: 'walk-3',
    user_id: 'usr-3',
    owner_name: 'Максим В.',
    pet: {
      id: 'pet-3',
      owner_id: 'usr-3',
      name: 'Роккі',
      breed: 'Доберман',
      age_years: 4,
      temperament: 'neutral',
      avatar_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
      vaccinated: true,
    },
    location: { lat: 47.8390, lng: 35.1430 }, // Sobornyi ave near Panorama
    heading: 270,
    walk_duration_mins: 42,
    distance_walked_km: 3.4,
    district_id: 'voznesenivskyi',
  },
  {
    id: 'walk-4',
    user_id: 'usr-4',
    owner_name: 'Катерина С.',
    pet: {
      id: 'pet-4',
      owner_id: 'usr-4',
      name: 'Луна',
      breed: 'Французький бульдог',
      age_years: 1.5,
      temperament: 'friendly',
      avatar_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80',
      vaccinated: true,
    },
    location: { lat: 47.8710, lng: 35.0910 }, // DniproHES view park
    heading: 15,
    walk_duration_mins: 19,
    distance_walked_km: 1.2,
    district_id: 'dniprovskyi',
  },
  {
    id: 'walk-5',
    user_id: 'usr-5',
    owner_name: 'Дмитро П.',
    pet: {
      id: 'pet-5',
      owner_id: 'usr-5',
      name: 'Тор',
      breed: 'Німецька вівчарка',
      age_years: 5,
      temperament: 'aggressive',
      avatar_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=300&q=80',
      vaccinated: true,
    },
    location: { lat: 47.7890, lng: 35.1810 }, // Dubovyi Hai park
    heading: 90,
    walk_duration_mins: 35,
    distance_walked_km: 2.8,
    district_id: 'komunarskyi',
  },
  {
    id: 'walk-6',
    user_id: 'usr-6',
    owner_name: 'Ірина Т.',
    pet: {
      id: 'pet-6',
      owner_id: 'usr-6',
      name: 'Міло',
      breed: 'Бігль',
      age_years: 2,
      temperament: 'friendly',
      avatar_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
      vaccinated: true,
    },
    location: { lat: 47.8250, lng: 35.1710 }, // Oleksandrivskyi square
    heading: 180,
    walk_duration_mins: 28,
    distance_walked_km: 2.1,
    district_id: 'oleksandrivskyi',
  },
];

export const INITIAL_GEO_NOTES: GeoNoteEntity[] = [
  {
    id: 'note-1',
    user_id: 'usr-9',
    author_name: 'Сергій (власник Хаскі)',
    category: 'hazard',
    sub_category: 'poison',
    comment: 'УВАГА! Розкидано підозрілий фарш із рожевими таблетками біля кущів біля фонтану!',
    photo_url: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=400&q=80',
    location: { lat: 47.8445, lng: 35.1340 },
    district_id: 'voznesenivskyi',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 22).toISOString(),
    upvotes: 14,
    clean_votes: 0,
    is_verified: true,
  },
  {
    id: 'note-2',
    user_id: 'usr-10',
    author_name: 'Анна В.',
    category: 'hazard',
    sub_category: 'broken_glass',
    comment: 'Розбиті пляшки вздовж доріжки біля лавочок. Небезпечно для лап!',
    location: { lat: 47.8420, lng: 35.1360 },
    district_id: 'voznesenivskyi',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 20).toISOString(),
    upvotes: 6,
    clean_votes: 1,
  },
  {
    id: 'note-3',
    user_id: 'usr-11',
    author_name: 'Олексій Д.',
    category: 'stray_dog',
    sub_category: 'stray_pack',
    comment: 'Зграя з 4 безпритульних собак біля гаражів, гавкають на повідкових собак.',
    location: { lat: 47.8380, lng: 35.1480 },
    district_id: 'voznesenivskyi',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 11).toISOString(),
    upvotes: 8,
    clean_votes: 0,
  },
  {
    id: 'note-4',
    user_id: 'usr-12',
    author_name: 'Ігор С.',
    category: 'useful_spot',
    sub_category: 'dog_box',
    comment: 'Новий дог-бокс, комунальники поповнили запас біопакетів!',
    location: { lat: 47.8460, lng: 35.1290 },
    district_id: 'voznesenivskyi',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    upvotes: 21,
    clean_votes: 0,
  },
  {
    id: 'note-5',
    user_id: 'usr-13',
    author_name: 'Клініка VetLider',
    category: 'useful_spot',
    sub_category: 'vet_clinic',
    comment: 'Цілодобова чергова ветклініка та лабораторія (пр. Соборний, 142). Є антидоти.',
    location: { lat: 47.8405, lng: 35.1410 },
    district_id: 'voznesenivskyi',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 180).toISOString(),
    upvotes: 45,
    clean_votes: 0,
    is_verified: true,
  },
  {
    id: 'note-6',
    user_id: 'usr-14',
    author_name: 'Комунальне КП',
    category: 'useful_spot',
    sub_category: 'dog_park',
    comment: 'Огороджений майданчик для вигулу з тренажерами та бар\'єрами.',
    location: { lat: 47.7870, lng: 35.1850 },
    district_id: 'komunarskyi',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 180).toISOString(),
    upvotes: 38,
    clean_votes: 0,
  },
];

export const INITIAL_SOS_ALERTS: SOSAlertEntity[] = [
  {
    id: 'sos-1',
    pet_id: 'pet-sos-1',
    pet_name: 'Рекс',
    pet_breed: 'Німецька вівчарка',
    pet_avatar: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=500&q=80',
    owner_id: 'usr-owner-1',
    owner_name: 'Володимир',
    owner_phone: '+380671234567',
    district_id: 'voznesenivskyi',
    last_seen_location: { lat: 47.8440, lng: 35.1320 },
    last_seen_address: 'Парк Перемоги / бульвар Шевченка, біля фонтану',
    reward_amount: 7000,
    description: 'Злякався сирени та побіг у бік житлових будинків. На шиї червоний шкіряний нашийник з адресником у вигляді кісточки. Відгукується на Рекса, не кусається.',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    sightings: [
      {
        id: 'sighting-1',
        reporter_name: 'Тетяна',
        reporter_phone: '+380509876543',
        comment: 'Бачила схожу вівчарку біля АТБ на пр. Соборному 20 хв тому!',
        location: { lat: 47.8410, lng: 35.1370 },
        reported_at: new Date(Date.now() - 1200000).toISOString(),
      },
    ],
  },
  {
    id: 'sos-2',
    pet_id: 'pet-sos-2',
    pet_name: 'Белла',
    pet_breed: 'Джек-рассел тер\'єр',
    pet_avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
    owner_id: 'usr-owner-2',
    owner_name: 'Юлія',
    owner_phone: '+380931112233',
    district_id: 'oleksandrivskyi',
    last_seen_location: { lat: 47.8210, lng: 35.1760 },
    last_seen_address: 'Вулиця Запорізька, біля Малого ринку',
    reward_amount: 4000,
    description: 'Дівчинка, 2 роки. Біла з рудими плямами на мордочці. Дуже швидка, може боятись незнайомих. Допоможіть знайти!',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    sightings: [],
  },
  {
    id: 'sos-3',
    pet_id: 'pet-sos-3',
    pet_name: 'Знайдено собаку (Хаскі)',
    pet_breed: 'Сибірський хаскі',
    pet_avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=500&q=80',
    owner_id: 'usr-owner-3',
    owner_name: 'Олександр (знайшов)',
    owner_phone: '+380993334455',
    district_id: 'dniprovskyi',
    last_seen_location: { lat: 47.8690, lng: 35.0920 },
    last_seen_address: 'Парк Металургів, біля оглядового майданчика на ДніпроГЕС',
    reward_amount: 0,
    description: 'Хлопчик хаскі з різнокольоровими очима (блакитне та каре). Сидів сам, притискався до людей. Тимчасово на перетримці у ветклініці поруч.',
    is_active: false, // Resolved / Found
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    sightings: [],
  },
];

export const PARTNER_PERKS: PartnerPerkEntity[] = [
  {
    id: 'perk-1',
    title: 'Знижка 20% на нашийники та адресники',
    business_name: 'MasterZoo Запоріжжя',
    discount_label: '-20%',
    description: 'Покажіть активний профіль DogApp на касі або введіть промокод онлайн. Безкоштовне гравіювання адреси на жетоні!',
    address: 'пр. Соборний, 147 (ТЦ "Україна")',
    location: { lat: 47.8425, lng: 35.1355 },
    district_id: 'voznesenivskyi',
    promo_code: 'DOGAPPZP20',
    valid_until: '2026-12-31',
    category: 'petshop',
    icon: 'Store',
  },
  {
    id: 'perk-2',
    title: 'Безкоштовний первинний огляд терапевта',
    business_name: 'Ветцентр "VetLider"',
    discount_label: '100% OFF',
    description: 'Огляд вух, зубів, зважування та консультація щодо вакцинації для користувачів DogApp Запоріжжя.',
    address: 'вул. Перемоги, 61',
    location: { lat: 47.8410, lng: 35.1415 },
    district_id: 'voznesenivskyi',
    promo_code: 'FIRSTVETZP',
    valid_until: '2026-11-30',
    category: 'vet',
    icon: 'Stethoscope',
  },
  {
    id: 'perk-3',
    title: 'Експрес-линька та спа для собак',
    business_name: 'Грумінг-студія "Teddy ZP"',
    discount_label: '-15%',
    description: 'Професійне вичісування підшерстку, гігієна лап та кігтів зі знижкою 15%.',
    address: 'вул. Незалежної України, 40',
    location: { lat: 47.8440, lng: 35.1280 },
    district_id: 'voznesenivskyi',
    promo_code: 'TEDDYZP15',
    valid_until: '2026-12-15',
    category: 'grooming',
    icon: 'Scissors',
  },
];

export const INITIAL_DISTRICT_CHATS: Record<string, DistrictChatMessage[]> = {
  voznesenivskyi: [
    {
      id: 'msg-1',
      user_id: 'usr-1',
      author_name: 'Олена М.',
      pet_name: 'Бадді (Ретривер)',
      district_id: 'voznesenivskyi',
      text: 'Привіт сусіди! Хтось іде на веселий вигул у парк біля Райдуги о 19:30? Бадді дуже хоче побігати з компанією!',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'msg-2',
      user_id: 'usr-2',
      author_name: 'Андрій К.',
      pet_name: 'Шелбі (Коргі)',
      district_id: 'voznesenivskyi',
      text: 'Ми з Шелбі підійдемо! Тільки погляньте на мапу, хтось щойно додав мітку отрути біля кущів, оминайте праву алею.',
      created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: 'msg-3',
      user_id: 'usr-owner-1',
      author_name: 'Володимир',
      pet_name: 'Рекс (Вівчарка)',
      district_id: 'voznesenivskyi',
      text: 'Друзі, благаю зверніть увагу! Зник мій Рекс на набережній. Якщо хтось помітить — натисніть у додатку "Я бачив її" або наберіть мене!',
      created_at: new Date(Date.now() - 3600000 * 1.1).toISOString(),
      is_emergency: true,
    },
  ],
  dniprovskyi: [
    {
      id: 'msg-4',
      user_id: 'usr-4',
      author_name: 'Катерина С.',
      pet_name: 'Луна (Бульдог)',
      district_id: 'dniprovskyi',
      text: 'Біля оглядового майданчика ДніпроГЕС дуже гарний захід сонця сьогодні! Багато собак гуляють.',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ],
  komunarskyi: [
    {
      id: 'msg-5',
      user_id: 'usr-5',
      author_name: 'Дмитро П.',
      pet_name: 'Тор (Вівчарка)',
      district_id: 'komunarskyi',
      text: 'У Дубовому Гаю комунальники нарешті відремонтували хвіртку дог-майданчика, тепер зачиняється надійно.',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
};
