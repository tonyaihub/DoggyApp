/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Web Push Notifications Hook (VAPID, Service Worker registration, Permission manager)
 */

import { useState, useEffect, useCallback } from 'react';

// Example VAPID Public Key for production registration
export const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuNuSbKISSk5g2VuW0qSWC8gOU';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [lastNotification, setLastNotification] = useState<PushNotificationPayload | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Register service worker if not already registered
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[DogApp SW] Service Worker registered with scope:', reg.scope);
          return reg.pushManager.getSubscription();
        })
        .then((sub) => {
          if (sub) {
            setSubscription(sub);
          }
        })
        .catch((err) => {
          console.warn('[DogApp SW] Service Worker registration failed:', err);
        });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Push notifications are not supported in this environment');
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);

      if (res === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        try {
          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
          setSubscription(sub);
          console.log('[DogApp Push] Subscribed successfully:', sub);
        } catch (subErr) {
          console.log('[DogApp Push] Local subscription note:', subErr);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error requesting push permission:', e);
      return false;
    }
  }, [isSupported]);

  // Trigger simulated local notification (or via SW if allowed)
  const sendAlert = useCallback(
    async (payload: PushNotificationPayload) => {
      setLastNotification(payload);

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon || '/icon.svg',
            badge: payload.badge || '/icon.svg',
            data: { url: payload.url || '/' },
          } as NotificationOptions);
        } catch (e) {
          console.log('SW notification fallback:', e);
        }
      }
    },
    []
  );

  return {
    isSupported,
    permission,
    isSubscribed: !!subscription || permission === 'granted',
    requestPermission,
    sendAlert,
    lastNotification,
    clearLastNotification: () => setLastNotification(null),
  };
}

// Helper to convert base64 VAPID key to Uint8Array for pushManager.subscribe
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
