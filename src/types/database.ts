/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Database Models and Spatial Types for DogApp (PostGIS & Frontend)
 */

export type SupportedLanguage = 'uk' | 'ru';

export type TemperamentType = 'friendly' | 'neutral' | 'aggressive';

export type GeoNoteCategory = 'hazard' | 'stray_dog' | 'useful_spot';

export type HazardSubCategory = 
  | 'poison'           // Догхантери / отрута
  | 'broken_glass'     // Бите скло
  | 'open_manhole'     // Відкритий люк / яма
  | 'stray_pack'       // Агресивна зграя безпритульних собак
  | 'dog_box'          // Дог-бокс з пакетами
  | 'dog_park'         // Огороджений майданчик для вигулу
  | 'vet_clinic'       // Цілодобова ветклініка
  | 'water_station';   // Поїлка для собак

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CityEntity {
  id: string; // e.g. "zaporizhzhia"
  country_code: string; // "UA"
  name_json: Record<SupportedLanguage, string>;
  center: GeoPoint;
  default_zoom: number;
  bounds?: [number, number][]; // Polygon coordinates
}

export interface DistrictEntity {
  id: string; // e.g. "voznesenivskyi"
  city_id: string;
  name_json: Record<SupportedLanguage, string>;
  center: GeoPoint;
  area_geojson?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface UserEntity {
  id: string; // UUID
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  default_language: SupportedLanguage;
  created_at: string;
  city_id: string;
  district_id: string;
}

export interface PetEntity {
  id: string; // UUID
  owner_id: string;
  name: string;
  breed: string;
  age_years?: number;
  weight_kg?: number;
  temperament: TemperamentType;
  avatar_url: string;
  bio?: string;
  vaccinated?: boolean;
}

export interface WalkRoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed_mps?: number;
}

export interface WalkSessionEntity {
  id: string; // UUID
  user_id: string;
  pet_id: string;
  pet_name: string;
  pet_avatar: string;
  pet_temperament: TemperamentType;
  route_points: WalkRoutePoint[]; // Representing PostGIS LINESTRING
  distance_meters: number;
  duration_seconds: number;
  calories_burned?: number;
  started_at: string;
  ended_at?: string;
  is_active: boolean;
  notes_count?: number;
}

export interface GeoNoteEntity {
  id: string; // UUID
  user_id: string;
  author_name: string;
  category: GeoNoteCategory;
  sub_category: HazardSubCategory;
  comment: string;
  photo_url?: string;
  location: GeoPoint; // PostGIS GEOMETRY(Point, 4326)
  district_id: string;
  created_at: string;
  expires_at: string; // TTL: 24h for hazard, 12h for stray_dog
  upvotes: number; // 👍 +12 hours extension
  clean_votes: number; // 🧹 3 votes = auto delete/resolved
  is_verified?: boolean;
}

export interface SOSSighting {
  id: string;
  reporter_name: string;
  reporter_phone?: string;
  comment: string;
  location: GeoPoint;
  photo_url?: string;
  reported_at: string;
}

export interface SOSAlertEntity {
  id: string; // UUID
  pet_id: string;
  pet_name: string;
  pet_breed: string;
  pet_avatar: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
  district_id: string;
  last_seen_location: GeoPoint; // PostGIS GEOMETRY(Point, 4326)
  last_seen_address: string;
  reward_amount?: number; // In UAH (e.g. 5000 ₴)
  description: string;
  is_active: boolean;
  created_at: string;
  sightings: SOSSighting[];
}

export interface PartnerPerkEntity {
  id: string;
  title: string;
  business_name: string;
  discount_label: string;
  description: string;
  address: string;
  location: GeoPoint;
  district_id: string;
  promo_code: string;
  valid_until: string;
  category: 'vet' | 'grooming' | 'petshop' | 'training';
  icon: string;
}

export interface DistrictChatMessage {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar?: string;
  pet_name?: string;
  district_id: string;
  text: string;
  created_at: string;
  is_emergency?: boolean;
}
