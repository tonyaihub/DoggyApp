/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Leaflet Dark Mode Map for DogApp (Zaporizhzhia)
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LiveWalkingDog } from '../data/zaporizhzhia';
import {
  GeoPoint,
  WalkRoutePoint,
  GeoNoteEntity,
  SOSAlertEntity,
  PartnerPerkEntity,
  DistrictEntity,
} from '../types/database';

export type MapTileType = 'dark' | 'voyager' | 'positron';

interface LeafletMapProps {
  center: GeoPoint;
  zoom: number;
  walkingDogs: LiveWalkingDog[];
  geoNotes: GeoNoteEntity[];
  sosAlerts: SOSAlertEntity[];
  partnerPerks: PartnerPerkEntity[];
  activeRoutePoints?: WalkRoutePoint[];
  userLocation?: GeoPoint | null;
  mapType?: MapTileType;
  onMapTypeChange?: (type: MapTileType) => void;
  activeFilters: {
    dogs: boolean;
    hazards: boolean;
    dogboxes: boolean;
    vets: boolean;
    parks: boolean;
    perks: boolean;
  };
  onSelectDog?: (dog: LiveWalkingDog) => void;
  onSelectHazard?: (note: GeoNoteEntity) => void;
  onSelectSOS?: (sos: SOSAlertEntity) => void;
  onSelectPerk?: (perk: PartnerPerkEntity) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  walkingDogs,
  geoNotes,
  sosAlerts,
  partnerPerks,
  activeRoutePoints = [],
  userLocation,
  mapType = 'dark',
  onMapTypeChange,
  activeFilters,
  onSelectDog,
  onSelectHazard,
  onSelectSOS,
  onSelectPerk,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const getTileConfig = (type: MapTileType) => {
    const cartoApiKey = (import.meta as any).env?.VITE_CARTO_API_KEY;
    const query = cartoApiKey ? `?api_key=${cartoApiKey}` : '';

    if (type === 'voyager') {
      // CARTO Voyager (Clean, colorful street navigation)
      return {
        url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png${query}`,
        options: {
          maxZoom: 20,
          subdomains: ['a', 'b', 'c', 'd'],
          attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
        },
      };
    }

    if (type === 'positron') {
      // CARTO Positron (Light minimalist)
      return {
        url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${query}`,
        options: {
          maxZoom: 20,
          subdomains: ['a', 'b', 'c', 'd'],
          attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
        },
      };
    }

    // Default: CARTO Dark Matter (Dark neo-modern)
    return {
      url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${query}`,
      options: {
        maxZoom: 20,
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
      },
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Default to Google Maps Satellite Hybrid
    const tileConfig = getTileConfig(mapType);
    const tileLayer = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    map.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer dynamically when mapType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileConfig = getTileConfig(mapType);
    const newLayer = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    newLayer.bringToBack();
    tileLayerRef.current = newLayer;
  }, [mapType]);

  // Center update
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
        animate: true,
      });
    }
  }, [center.lat, center.lng, zoom]);

  // Update Route Polyline (live walk track)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeRoutePoints.length > 1) {
      const latlngs: [number, number][] = activeRoutePoints.map((pt) => [pt.lat, pt.lng]);
      if (routePolylineRef.current) {
        routePolylineRef.current.setLatLngs(latlngs);
      } else {
        const polyline = L.polyline(latlngs, {
          color: '#818cf8',
          weight: 5,
          opacity: 0.9,
          lineJoin: 'round',
          dashArray: undefined,
        }).addTo(map);
        routePolylineRef.current = polyline;
      }
    } else if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
  }, [activeRoutePoints]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-8 h-8 rounded-full bg-indigo-500/30 animate-ping"></span>
        <div class="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px]">
          🐾
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'custom-user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
    }
  }, [userLocation]);

  // Update Markers (Dogs, Hazards, POIs, SOS)
  useEffect(() => {
    const markersGroup = markersLayerRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // 1. Walking Dogs Markers
    if (activeFilters.dogs) {
      walkingDogs.forEach((dog) => {
        const ringColor =
          dog.pet.temperament === 'friendly'
            ? 'border-emerald-500 shadow-emerald-500/30'
            : dog.pet.temperament === 'neutral'
            ? 'border-amber-500 shadow-amber-500/30'
            : 'border-rose-500 shadow-rose-500/30';

        const pulseColor =
          dog.pet.temperament === 'friendly'
            ? 'bg-emerald-500/30'
            : dog.pet.temperament === 'neutral'
            ? 'bg-amber-500/30'
            : 'bg-rose-500/30';

        const dogHtml = `
          <div class="group relative cursor-pointer flex flex-col items-center">
            <span class="absolute -top-1 w-12 h-12 rounded-full ${pulseColor} animate-ping opacity-60"></span>
            <div class="relative w-10 h-10 rounded-full border-2 ${ringColor} shadow-xl overflow-hidden bg-zinc-900 transition-transform transform hover:scale-110">
              <img src="${dog.pet.avatar_url}" alt="${dog.pet.name}" class="w-full h-full object-cover" />
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-zinc-900/90 text-[10px] font-semibold text-zinc-200 border border-zinc-700 whitespace-nowrap shadow-md">
              ${dog.pet.name}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: dogHtml,
          className: 'custom-dog-marker',
          iconSize: [48, 56],
          iconAnchor: [24, 28],
        });

        const marker = L.marker([dog.location.lat, dog.location.lng], { icon });
        marker.on('click', () => {
          if (onSelectDog) onSelectDog(dog);
        });
        markersGroup.addLayer(marker);
      });
    }

    // 2. Active SOS Markers (Red Emergency Rings)
    sosAlerts
      .filter((s) => s.is_active)
      .forEach((sos) => {
        const sosHtml = `
          <div class="relative flex flex-col items-center cursor-pointer animate-bounce">
            <span class="absolute w-14 h-14 rounded-full bg-rose-600/40 animate-ping"></span>
            <div class="w-11 h-11 rounded-full border-3 border-rose-600 bg-rose-950/90 shadow-2xl overflow-hidden flex items-center justify-center">
              <img src="${sos.pet_avatar}" alt="${sos.pet_name}" class="w-full h-full object-cover" />
            </div>
            <div class="mt-0.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black tracking-wider uppercase shadow-lg">
              SOS ${sos.pet_name}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: sosHtml,
          className: 'custom-sos-marker',
          iconSize: [50, 60],
          iconAnchor: [25, 30],
        });

        const marker = L.marker([sos.last_seen_location.lat, sos.last_seen_location.lng], { icon });
        marker.on('click', () => {
          if (onSelectSOS) onSelectSOS(sos);
        });
        markersGroup.addLayer(marker);
      });

    // 3. Geo Notes & Hazards
    geoNotes.forEach((note) => {
      // Check filters
      if (note.category === 'hazard' && !activeFilters.hazards) return;
      if (note.category === 'stray_dog' && !activeFilters.hazards) return;
      if (note.sub_category === 'dog_box' && !activeFilters.dogboxes) return;
      if (note.sub_category === 'vet_clinic' && !activeFilters.vets) return;
      if (note.sub_category === 'dog_park' && !activeFilters.parks) return;

      let iconBg = 'bg-rose-500 border-rose-300';
      let iconEmoji = '⚠️';

      if (note.sub_category === 'poison') {
        iconBg = 'bg-rose-600 border-rose-400';
        iconEmoji = '☠️';
      } else if (note.sub_category === 'broken_glass') {
        iconBg = 'bg-amber-600 border-amber-300';
        iconEmoji = '🍷';
      } else if (note.sub_category === 'stray_pack') {
        iconBg = 'bg-orange-600 border-orange-300';
        iconEmoji = '🐺';
      } else if (note.sub_category === 'dog_box') {
        iconBg = 'bg-emerald-600 border-emerald-300';
        iconEmoji = '💩';
      } else if (note.sub_category === 'vet_clinic') {
        iconBg = 'bg-sky-600 border-sky-300';
        iconEmoji = '🏥';
      } else if (note.sub_category === 'dog_park') {
        iconBg = 'bg-indigo-600 border-indigo-300';
        iconEmoji = '🏞️';
      }

      const noteHtml = `
        <div class="relative cursor-pointer transition-transform hover:scale-125">
          <div class="w-8 h-8 rounded-xl ${iconBg} border text-white shadow-lg flex items-center justify-center text-sm">
            ${iconEmoji}
          </div>
          ${
            note.category === 'hazard'
              ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>'
              : ''
          }
        </div>
      `;

      const icon = L.divIcon({
        html: noteHtml,
        className: 'custom-note-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([note.location.lat, note.location.lng], { icon });
      marker.on('click', () => {
        if (onSelectHazard) onSelectHazard(note);
      });
      markersGroup.addLayer(marker);
    });

    // 4. Partner Perks
    if (activeFilters.perks) {
      partnerPerks.forEach((perk) => {
        const perkHtml = `
          <div class="relative cursor-pointer transition-transform hover:scale-110">
            <div class="px-2 py-1 rounded-lg bg-indigo-600/90 border border-indigo-400 text-white font-bold text-[10px] shadow-lg flex items-center gap-1">
              <span>🎁</span>
              <span>${perk.discount_label}</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: perkHtml,
          className: 'custom-perk-marker',
          iconSize: [60, 26],
          iconAnchor: [30, 13],
        });

        const marker = L.marker([perk.location.lat, perk.location.lng], { icon });
        marker.on('click', () => {
          if (onSelectPerk) onSelectPerk(perk);
        });
        markersGroup.addLayer(marker);
      });
    }
  }, [
    walkingDogs,
    geoNotes,
    sosAlerts,
    partnerPerks,
    activeFilters,
    onSelectDog,
    onSelectHazard,
    onSelectSOS,
    onSelectPerk,
  ]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full bg-zinc-950 z-0" />
    </div>
  );
};
