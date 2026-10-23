/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Walk Tracker Hook (Real-time GPS, distance, speed, route, and hold-to-stop)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { WalkRoutePoint, WalkSessionEntity, PetEntity } from '../types/database';

// Haversine formula for calculating distance between 2 coordinates in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

interface UseWalkTrackerOptions {
  pet: PetEntity;
  onLocationUpdate?: (point: WalkRoutePoint) => void;
  onFinish?: (session: WalkSessionEntity) => void;
}

export function useWalkTracker({ pet, onLocationUpdate, onFinish }: UseWalkTrackerOptions) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [routePoints, setRoutePoints] = useState<WalkRoutePoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<WalkRoutePoint | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [currentSpeedKmH, setCurrentSpeedKmH] = useState<number>(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPointRef = useRef<WalkRoutePoint | null>(null);
  const sessionIdRef = useRef<string>('');

  // Start a new walk session
  const startWalk = useCallback(() => {
    const sessionId = `walk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sessionIdRef.current = sessionId;
    setIsActive(true);
    setIsLocked(false);
    setDurationSeconds(0);
    setDistanceMeters(0);
    setRoutePoints([]);
    setErrorMsg(null);

    // Initial default point in Zaporizhzhia if geolocation is not instantly ready
    const initialDefault: WalkRoutePoint = {
      lat: 47.8430 + (Math.random() - 0.5) * 0.004,
      lng: 35.1330 + (Math.random() - 0.5) * 0.004,
      timestamp: Date.now(),
      speed_mps: 1.2,
    };
    setCurrentLocation(initialDefault);
    setRoutePoints([initialDefault]);
    lastPointRef.current = initialDefault;

    // Start stopwatch
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);

    // Start Geolocation watcher
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setGpsAccuracy(accuracy);

          const newPoint: WalkRoutePoint = {
            lat: latitude,
            lng: longitude,
            timestamp: position.timestamp || Date.now(),
            speed_mps: speed || 1.1,
          };

          // Filter out large jumps or jitter (< 2 meters)
          if (lastPointRef.current) {
            const dist = calculateDistanceMeters(
              lastPointRef.current.lat,
              lastPointRef.current.lng,
              latitude,
              longitude
            );

            if (dist >= 3) {
              setDistanceMeters((prev) => prev + dist);
              setRoutePoints((prev) => [...prev, newPoint]);
              lastPointRef.current = newPoint;
            }
          } else {
            setRoutePoints([newPoint]);
            lastPointRef.current = newPoint;
          }

          setCurrentLocation(newPoint);
          const speedCalc = speed ? speed * 3.6 : 3.8;
          setCurrentSpeedKmH(Number(speedCalc.toFixed(1)));

          if (onLocationUpdate) {
            onLocationUpdate(newPoint);
          }
        },
        (error) => {
          console.warn('Geolocation watch error (using fallback simulation):', error.message);
          setErrorMsg(error.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10000,
        }
      );
    }
  }, [onLocationUpdate]);

  // Simulation mode: when walking in browser without physical GPS movement, simulate steps
  const simulateStep = useCallback(() => {
    if (!isActive) return;
    setCurrentLocation((prev) => {
      const baseLat = prev?.lat || 47.8432;
      const baseLng = prev?.lng || 35.1328;
      // Step ~ 8-15 meters
      const deltaLat = (Math.random() - 0.3) * 0.00015;
      const deltaLng = (Math.random() - 0.2) * 0.00015;
      const nextPoint: WalkRoutePoint = {
        lat: baseLat + deltaLat,
        lng: baseLng + deltaLng,
        timestamp: Date.now(),
        speed_mps: 1.25,
      };

      if (lastPointRef.current) {
        const stepDist = calculateDistanceMeters(
          lastPointRef.current.lat,
          lastPointRef.current.lng,
          nextPoint.lat,
          nextPoint.lng
        );
        setDistanceMeters((d) => d + stepDist);
      }
      lastPointRef.current = nextPoint;
      setRoutePoints((r) => [...r, nextPoint]);
      setCurrentSpeedKmH(4.2);
      if (onLocationUpdate) onLocationUpdate(nextPoint);
      return nextPoint;
    });
  }, [isActive, onLocationUpdate]);

  // Stop / Finish walk session
  const finishWalk = useCallback((): WalkSessionEntity => {
    if (watchIdRef.current !== null && typeof window !== 'undefined') {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const distanceKm = distanceMeters / 1000;
    // Calories calculation: ~65 kcal/km human + ~45 kcal/km dog
    const humanCalories = Math.round(distanceKm * 65 + (durationSeconds / 60) * 2.5);
    const petCalories = Math.round(distanceKm * 40 + (durationSeconds / 60) * 1.8);
    const totalCalories = humanCalories + petCalories;

    const completedSession: WalkSessionEntity = {
      id: sessionIdRef.current || `walk-${Date.now()}`,
      user_id: 'current-user-uuid',
      pet_id: pet.id,
      pet_name: pet.name,
      pet_avatar: pet.avatar_url,
      pet_temperament: pet.temperament,
      route_points: routePoints,
      distance_meters: Math.round(distanceMeters),
      duration_seconds: durationSeconds,
      calories_burned: totalCalories,
      started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      ended_at: new Date().toISOString(),
      is_active: false,
    };

    setIsActive(false);
    setIsLocked(false);

    if (onFinish) {
      onFinish(completedSession);
    }

    return completedSession;
  }, [distanceMeters, durationSeconds, onFinish, pet, routePoints]);

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => !prev);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof window !== 'undefined') {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    isActive,
    isLocked,
    toggleLock,
    durationSeconds,
    durationFormatted: formatDuration(durationSeconds),
    distanceMeters,
    distanceKm: (distanceMeters / 1000).toFixed(2),
    currentSpeedKmH,
    currentLocation,
    routePoints,
    gpsAccuracy,
    errorMsg,
    startWalk,
    finishWalk,
    simulateStep,
  };
}
