/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * DogApp - Principal Architecture & Master App Shell
 * Target: Zaporizhzhia, Ukraine (7 Districts) & Scalable Multi-City Architecture
 */

import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './lib/i18n/context';
import { Header } from './components/Header';
import { BottomNavigation, ActiveNavTab } from './components/BottomNavigation';
import { SOSBanner } from './components/SOSBanner';
import { MapScreen } from './screens/MapScreen';
import { ActiveWalkScreen } from './screens/ActiveWalkScreen';
import { SOSScreen } from './screens/SOSScreen';
import { DistrictChatScreen } from './screens/DistrictChatScreen';
import { NewsScreen } from './screens/NewsScreen';

// Modals
import { HazardRadarModal } from './components/HazardRadarModal';
import { SOSSightingModal } from './components/SOSSightingModal';
import { SOSCreateModal } from './components/SOSCreateModal';
import { DogDetailModal } from './components/DogDetailModal';
import { HazardDetailModal } from './components/HazardDetailModal';
import { PartnerPerkModal } from './components/PartnerPerkModal';
import { UserProfileModal } from './components/UserProfileModal';
import { WalkSummaryModal } from './components/WalkSummaryModal';

// Data & Types
import {
  CITIES,
  ZAPORIZHZHIA_DISTRICTS,
  INITIAL_WALKING_DOGS,
  INITIAL_GEO_NOTES,
  INITIAL_SOS_ALERTS,
  PARTNER_PERKS,
  INITIAL_DISTRICT_CHATS,
  LiveWalkingDog,
} from './data/zaporizhzhia';
import {
  CityEntity,
  DistrictEntity,
  GeoNoteEntity,
  SOSAlertEntity,
  PartnerPerkEntity,
  PetEntity,
  WalkSessionEntity,
  GeoPoint,
} from './types/database';
import { usePushNotifications } from './hooks/usePushNotifications';

function DogAppContent() {
  const { t, language } = useI18n();
  const { sendAlert } = usePushNotifications();

  // App-level Navigation and View States
  const [currentCity, setCurrentCity] = useState<CityEntity>(CITIES[0]); // Zaporizhzhia
  const [currentDistrict, setCurrentDistrict] = useState<DistrictEntity>(ZAPORIZHZHIA_DISTRICTS[0]); // Voznesenivskyi
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('map');
  const [isWalking, setIsWalking] = useState(false);

  // Entities & Live Data State
  const [walkingDogs, setWalkingDogs] = useState<LiveWalkingDog[]>(INITIAL_WALKING_DOGS);
  const [geoNotes, setGeoNotes] = useState<GeoNoteEntity[]>(INITIAL_GEO_NOTES);
  const [sosAlerts, setSosAlerts] = useState<SOSAlertEntity[]>(INITIAL_SOS_ALERTS);
  const [partnerPerks] = useState<PartnerPerkEntity[]>(PARTNER_PERKS);
  const [districtChats, setDistrictChats] = useState(INITIAL_DISTRICT_CHATS);

  // User Profile Pet
  const [userPet, setUserPet] = useState<PetEntity>({
    id: 'my-pet-uuid',
    owner_id: 'current-user-uuid',
    name: 'Бадді',
    breed: 'Золотистий ретривер',
    age_years: 3,
    weight_kg: 28,
    temperament: 'friendly',
    avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    vaccinated: true,
  });

  // User Geolocation (initialized to Voznesenivskyi center)
  const [userLocation, setUserLocation] = useState<GeoPoint>({
    lat: 47.8432,
    lng: 35.1328,
  });

  // Modals visibility states
  const [selectedDog, setSelectedDog] = useState<LiveWalkingDog | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<GeoNoteEntity | null>(null);
  const [selectedSOS, setSelectedSOS] = useState<SOSAlertEntity | null>(null);
  const [sightingSOS, setSightingSOS] = useState<SOSAlertEntity | null>(null);
  const [selectedPerk, setSelectedPerk] = useState<PartnerPerkEntity | null>(null);
  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
  const [isSOSCreateOpen, setIsSOSCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [completedSession, setCompletedSession] = useState<WalkSessionEntity | null>(null);

  // Keep user location updated if browser geolocation available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // If in Ukraine/Zaporizhzhia region, adopt it, else keep default realistic Zaporizhzhia coordinates
          if (pos.coords.latitude > 45 && pos.coords.latitude < 52) {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          }
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  // Update center when district changes
  const handleSelectDistrict = (district: DistrictEntity) => {
    setCurrentDistrict(district);
    setUserLocation(district.center);
  };

  // Find active SOS in current district
  const activeDistrictSOS = sosAlerts.find(
    (a) => a.is_active && a.district_id === currentDistrict.id
  );

  // Handlers for Hazard operations
  const handlePublishHazard = (hazardData: {
    category: GeoNoteEntity['category'];
    sub_category: GeoNoteEntity['sub_category'];
    comment: string;
    photo_url?: string;
    location: GeoPoint;
    district_id: string;
  }) => {
    const ttlHours = hazardData.category === 'hazard' ? 24 : 12;
    const newNote: GeoNoteEntity = {
      id: `note-${Date.now()}`,
      user_id: 'current-user-uuid',
      author_name: `${userPet.name} (Господар)`,
      category: hazardData.category,
      sub_category: hazardData.sub_category,
      comment: hazardData.comment,
      photo_url: hazardData.photo_url,
      location: hazardData.location,
      district_id: hazardData.district_id,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + ttlHours * 3600000).toISOString(),
      upvotes: 1,
      clean_votes: 0,
    };

    setGeoNotes((prev) => [newNote, ...prev]);

    // Send push notification to neighbors
    sendAlert({
      title: '⚠️ Увага: Небезпека у вашому районі!',
      body: `${hazardData.comment} (${currentDistrict.name_json[language]})`,
      tag: 'hazard-alert',
    });
  };

  const handleUpvoteHazard = (noteId: string) => {
    setGeoNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          // Extend TTL by 12 hours
          const currentExp = new Date(n.expires_at).getTime();
          return {
            ...n,
            upvotes: n.upvotes + 1,
            expires_at: new Date(currentExp + 12 * 3600000).toISOString(),
          };
        }
        return n;
      })
    );
  };

  const handleCleanVoteHazard = (noteId: string) => {
    setGeoNotes((prev) => {
      return prev
        .map((n) => (n.id === noteId ? { ...n, clean_votes: n.clean_votes + 1 } : n))
        .filter((n) => n.clean_votes < 3); // 3 clicks = automatically deleted!
    });
  };

  // Handlers for SOS operations
  const handlePublishSOS = (newAlertData: Omit<SOSAlertEntity, 'id' | 'created_at' | 'sightings'>) => {
    const newAlert: SOSAlertEntity = {
      ...newAlertData,
      id: `sos-${Date.now()}`,
      created_at: new Date().toISOString(),
      sightings: [],
    };

    setSosAlerts((prev) => [newAlert, ...prev]);

    // Dispatch instant radar push
    sendAlert({
      title: `🚨 SOS: ЗНИК СОБАКА (${newAlert.pet_name})!`,
      body: `${newAlert.pet_breed} у районі ${currentDistrict.name_json[language]}. Винагорода: ${newAlert.reward_amount} ₴`,
      tag: 'sos-alert',
    });
  };

  const handleSubmitSighting = (
    sosId: string,
    sighting: {
      reporter_name: string;
      reporter_phone?: string;
      comment: string;
      photo_url?: string;
      location: GeoPoint;
    }
  ) => {
    setSosAlerts((prev) =>
      prev.map((a) => {
        if (a.id === sosId) {
          return {
            ...a,
            sightings: [
              ...a.sightings,
              {
                id: `sighting-${Date.now()}`,
                ...sighting,
                reported_at: new Date().toISOString(),
              },
            ],
          };
        }
        return a;
      })
    );

    sendAlert({
      title: '👁️ Нова мітка: вашу собаку бачили!',
      body: `${sighting.reporter_name}: "${sighting.comment}"`,
      tag: 'sos-sighting',
    });
  };

  // Handlers for District Chat
  const handleSendChatMessage = (text: string, isEmergency = false) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      user_id: 'current-user-uuid',
      author_name: 'Ви',
      pet_name: `${userPet.name} (${userPet.breed})`,
      district_id: currentDistrict.id,
      text,
      created_at: new Date().toISOString(),
      is_emergency: isEmergency,
    };

    setDistrictChats((prev) => ({
      ...prev,
      [currentDistrict.id]: [...(prev[currentDistrict.id] || []), newMsg],
    }));

    if (isEmergency) {
      sendAlert({
        title: `🚨 Термінове повідомлення в чаті: ${currentDistrict.name_json[language]}`,
        body: text,
      });
    }
  };

  const handleShareWalkToDistrictFeed = (session: WalkSessionEntity) => {
    const distKm = (session.distance_meters / 1000).toFixed(2);
    const text = `🐾 Чудова прогулянка з ${session.pet_name}! Пройдено ${distKm} км за ${Math.round(
      session.duration_seconds / 60
    )} хв. Собаки Запоріжжя, приєднуйтесь до вигулу!`;
    handleSendChatMessage(text, false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={setCurrentCity}
        currentDistrict={currentDistrict}
        onSelectDistrict={handleSelectDistrict}
        onOpenProfile={() => setIsProfileOpen(true)}
        userPet={userPet}
      />

      {/* SOS High-Urgency Banner if active in district */}
      {!isWalking && activeDistrictSOS && (
        <SOSBanner
          alert={activeDistrictSOS}
          onOpenAlert={(alert) => {
            setSelectedSOS(alert);
            setActiveTab('sos');
          }}
          onOpenSighting={(alert) => setSightingSOS(alert)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 relative">
        {isWalking ? (
          <ActiveWalkScreen
            userPet={userPet}
            districtId={currentDistrict.id}
            onFinishWalkSession={(session) => {
              setIsWalking(false);
              setCompletedSession(session);
            }}
            onOpenHazardModal={() => setIsHazardModalOpen(true)}
            onCancelWalk={() => setIsWalking(false)}
          />
        ) : (
          <>
            {activeTab === 'map' && (
              <MapScreen
                currentDistrict={currentDistrict}
                walkingDogs={walkingDogs}
                geoNotes={geoNotes}
                sosAlerts={sosAlerts}
                partnerPerks={partnerPerks}
                userLocation={userLocation}
                onSelectDog={setSelectedDog}
                onSelectHazard={setSelectedHazard}
                onSelectSOS={(sos) => {
                  setSelectedSOS(sos);
                  setActiveTab('sos');
                }}
                onSelectPerk={setSelectedPerk}
                onStartWalk={() => setIsWalking(true)}
                onOpenHazardModal={() => setIsHazardModalOpen(true)}
              />
            )}

            {activeTab === 'chat' && (
              <DistrictChatScreen
                currentDistrict={currentDistrict}
                messages={districtChats[currentDistrict.id] || []}
                onSendMessage={handleSendChatMessage}
                userPet={userPet}
              />
            )}

            {activeTab === 'sos' && (
              <SOSScreen
                alerts={sosAlerts}
                onOpenCreateWizard={() => setIsSOSCreateOpen(true)}
                onOpenSightingModal={(alert) => setSightingSOS(alert)}
                currentDistrictId={currentDistrict.id}
              />
            )}

            {activeTab === 'news' && <NewsScreen />}
          </>
        )}
      </main>

      {/* Bottom Navigation (Hidden during active walk for pure screen focus) */}
      {!isWalking && (
        <BottomNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeSOSCount={sosAlerts.filter((a) => a.is_active).length}
        />
      )}

      {/* MODALS */}
      {/* 1. Rapid Hazard Radar Modal */}
      <HazardRadarModal
        isOpen={isHazardModalOpen}
        onClose={() => setIsHazardModalOpen(false)}
        userLocation={userLocation}
        districtId={currentDistrict.id}
        onPublish={handlePublishHazard}
      />

      {/* 2. SOS Sighting Modal ("Я бачив цю собаку!") */}
      <SOSSightingModal
        isOpen={!!sightingSOS}
        onClose={() => setSightingSOS(null)}
        sosAlert={sightingSOS}
        userLocation={userLocation}
        onSubmitSighting={handleSubmitSighting}
      />

      {/* 3. SOS Create Alert Wizard */}
      <SOSCreateModal
        isOpen={isSOSCreateOpen}
        onClose={() => setIsSOSCreateOpen(false)}
        defaultDistrictId={currentDistrict.id}
        defaultLocation={userLocation}
        onPublish={handlePublishSOS}
      />

      {/* 4. Dog Detail Modal */}
      <DogDetailModal
        dog={selectedDog}
        onClose={() => setSelectedDog(null)}
        onStartChat={(dog) => {
          setActiveTab('chat');
        }}
      />

      {/* 5. Hazard Detail Modal with Upvote / Clean Vote */}
      <HazardDetailModal
        note={selectedHazard}
        onClose={() => setSelectedHazard(null)}
        onUpvote={handleUpvoteHazard}
        onCleanVote={handleCleanVoteHazard}
      />

      {/* 6. Partner Perk Modal */}
      <PartnerPerkModal perk={selectedPerk} onClose={() => setSelectedPerk(null)} />

      {/* 7. User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        pet={userPet}
        onSavePet={setUserPet}
      />

      {/* 8. Walk Summary Modal */}
      <WalkSummaryModal
        session={completedSession}
        onClose={() => setCompletedSession(null)}
        onShareToDistrictFeed={handleShareWalkToDistrictFeed}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <DogAppContent />
    </I18nProvider>
  );
}
