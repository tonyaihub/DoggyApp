/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Real-time Gateway and Spatial Broadcaster (/ws/walks)
 * Simulates Redis GEOADD / GEOSEARCH radius distribution + PostGIS pipeline
 */

import { WalkRoutePoint, GeoPoint } from '../types/database';
import { LiveWalkingDog } from '../data/zaporizhzhia';
import { calculateDistanceMeters } from '../hooks/useWalkTracker';

export interface WalkLocationPayload {
  walk_id: string;
  user_id: string;
  pet_name: string;
  pet_breed: string;
  avatar_url: string;
  temperament: 'friendly' | 'neutral' | 'aggressive';
  point: WalkRoutePoint;
  district_id: string;
}

export type RealtimeEventHandler = (data: any) => void;

class RealtimeWalkGateway {
  private listeners: Map<string, Set<RealtimeEventHandler>> = new Map();
  private activeWalks: Map<string, WalkLocationPayload> = new Map();
  private walkRoutes: Map<string, WalkRoutePoint[]> = new Map();

  constructor() {
    // Initialize mock gateway
  }

  public subscribe(event: string, handler: RealtimeEventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  public emit(event: string, data: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  /**
   * 1. walk:start - Register active session
   */
  public startWalkSession(payload: WalkLocationPayload) {
    this.activeWalks.set(payload.walk_id, payload);
    this.walkRoutes.set(payload.walk_id, [payload.point]);

    console.log(`[Redis GEOADD] Simulated: GEOADD live_walks ${payload.point.lng} ${payload.point.lat} ${payload.walk_id}`);
    this.emit('walk:started', payload);
  }

  /**
   * 2. walk:location_update - GEOADD in Redis and GEOSEARCH within 1.5km
   */
  public updateLocation(payload: WalkLocationPayload) {
    this.activeWalks.set(payload.walk_id, payload);
    const existingRoute = this.walkRoutes.get(payload.walk_id) || [];
    existingRoute.push(payload.point);
    this.walkRoutes.set(payload.walk_id, existingRoute);

    // Filter subscribers within 1.5 km (1500m)
    console.log(`[Redis GEOADD] Updated: GEOADD live_walks ${payload.point.lng} ${payload.point.lat} ${payload.walk_id}`);
    console.log(`[Redis GEOSEARCH] Simulated: GEOSEARCH live_walks FROMLONLAT ${payload.point.lng} ${payload.point.lat} BYRADIUS 1.5 km`);

    this.emit('walk:location_update', payload);
  }

  /**
   * 3. walk:end - Aggregate points from Redis and save as PostGIS LineString (ST_MakeLine)
   */
  public endWalkSession(walk_id: string): { points: WalkRoutePoint[]; lineStringSQL: string } {
    const route = this.walkRoutes.get(walk_id) || [];
    this.activeWalks.delete(walk_id);

    // Generate PostGIS ST_MakeLine query representation
    const pointsSQL = route.map((pt) => `ST_SetSRID(ST_MakePoint(${pt.lng}, ${pt.lat}), 4326)`).join(', ');
    const postgisLineStringQuery = `
      -- PostGIS ST_MakeLine compilation
      INSERT INTO walk_sessions (id, route, distance_meters, ended_at, is_active)
      VALUES (
        '${walk_id}',
        ST_MakeLine(ARRAY[${pointsSQL || "ST_SetSRID(ST_MakePoint(35.13, 47.84), 4326)"}]),
        ST_Length(ST_MakeLine(ARRAY[${pointsSQL || "ST_SetSRID(ST_MakePoint(35.13, 47.84), 4326)"}])::geography),
        NOW(),
        false
      );
    `;

    console.log('[PostGIS Pipeline] Assembled ST_MakeLine query:', postgisLineStringQuery);
    this.emit('walk:ended', { walk_id, pointCount: route.length });

    return {
      points: route,
      lineStringSQL: postgisLineStringQuery,
    };
  }

  /**
   * Get active walks within radius of user
   */
  public getNearbyWalks(userLocation: GeoPoint, radiusMeters: number = 1500): WalkLocationPayload[] {
    const nearby: WalkLocationPayload[] = [];
    this.activeWalks.forEach((walk) => {
      const dist = calculateDistanceMeters(
        userLocation.lat,
        userLocation.lng,
        walk.point.lat,
        walk.point.lng
      );
      if (dist <= radiusMeters) {
        nearby.push(walk);
      }
    });
    return nearby;
  }
}

export const realtimeGateway = new RealtimeWalkGateway();
