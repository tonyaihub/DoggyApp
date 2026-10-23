-- ==============================================================================
-- DogApp Production Database Migrations: PostgreSQL + PostGIS (Spatial Engine)
-- Target: Zaporizhzhia Launch & Scalable Multi-City Architecture
-- ==============================================================================

-- 1. Enable PostGIS Extension and UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUM Types
DO $$ BEGIN
    CREATE TYPE pet_temperament AS ENUM ('friendly', 'neutral', 'aggressive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE geo_note_category AS ENUM ('hazard', 'stray_dog', 'useful_spot');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CITIES Table (Multi-city ready)
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL DEFAULT 'UA',
    name_json JSONB NOT NULL, -- {"uk": "Запоріжжя", "ru": "Запорожье"}
    center GEOMETRY(Point, 4326) NOT NULL,
    bounds GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cities_center ON cities USING GIST (center);
CREATE INDEX IF NOT EXISTS idx_cities_bounds ON cities USING GIST (bounds);

-- 4. DISTRICTS Table (7 administrative districts of Zaporizhzhia + extensible)
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(64) PRIMARY KEY,
    city_id VARCHAR(64) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name_json JSONB NOT NULL,
    center GEOMETRY(Point, 4326) NOT NULL,
    area GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_districts_area ON districts USING GIST (area);
CREATE INDEX IF NOT EXISTS idx_districts_city_id ON districts (city_id);

-- 5. USERS Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(32),
    default_language VARCHAR(5) NOT NULL DEFAULT 'uk',
    city_id VARCHAR(64) REFERENCES cities(id),
    district_id VARCHAR(64) REFERENCES districts(id),
    fcm_push_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PETS Table
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age_years NUMERIC(3, 1),
    weight_kg NUMERIC(4, 1),
    temperament pet_temperament NOT NULL DEFAULT 'friendly',
    avatar_url TEXT NOT NULL,
    bio TEXT,
    vaccinated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets (owner_id);

-- 7. WALK_SESSIONS Table (LineString for route)
CREATE TABLE IF NOT EXISTS walk_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    route GEOMETRY(LineString, 4326), -- PostGIS LineString geometry
    distance_meters NUMERIC(10, 2) NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_walk_sessions_route ON walk_sessions USING GIST (route);
CREATE INDEX IF NOT EXISTS idx_walk_sessions_user_id ON walk_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_walk_sessions_is_active ON walk_sessions (is_active);

-- 8. GEO_NOTES Table (Hazards, Stray packs, Dog-boxes, Clinics) with GIST Index
CREATE TABLE IF NOT EXISTS geo_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    district_id VARCHAR(64) REFERENCES districts(id),
    category geo_note_category NOT NULL,
    sub_category VARCHAR(64) NOT NULL,
    comment TEXT NOT NULL,
    photo_url TEXT,
    location GEOMETRY(Point, 4326) NOT NULL, -- Point (lng, lat) in SRID 4326
    upvotes INTEGER NOT NULL DEFAULT 0,
    clean_votes INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crucial GIST index for fast spatial radius query (ST_DWithin)
CREATE INDEX IF NOT EXISTS idx_geo_notes_location ON geo_notes USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_geo_notes_expires ON geo_notes (expires_at);

-- 9. SOS_ALERTS Table (Lost dogs radar)
CREATE TABLE IF NOT EXISTS sos_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    district_id VARCHAR(64) NOT NULL REFERENCES districts(id),
    last_seen_location GEOMETRY(Point, 4326) NOT NULL,
    last_seen_address TEXT NOT NULL,
    reward_amount NUMERIC(10, 2) DEFAULT 0,
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_location ON sos_alerts USING GIST (last_seen_location);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_is_active ON sos_alerts (is_active);

-- 10. SOS_SIGHTINGS Table ("Я бачив цю собаку!")
CREATE TABLE IF NOT EXISTS sos_sightings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sos_id UUID NOT NULL REFERENCES sos_alerts(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id),
    comment TEXT NOT NULL,
    photo_url TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sos_sightings_location ON sos_sightings USING GIST (location);

-- ==============================================================================
-- POSTGIS HELPER QUERIES & PROCEDURES (ST_DWithin, ST_MakeLine, ST_Length)
-- ==============================================================================

-- 1. Find all active hazards within radius_meters of user location (ST_DWithin)
-- Usage: SELECT * FROM get_nearby_hazards(35.1395, 47.8388, 1500); -- Lng, Lat, radius
CREATE OR REPLACE FUNCTION get_nearby_hazards(
    user_lng DOUBLE PRECISION,
    user_lat DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 1500
)
RETURNS TABLE (
    id UUID,
    category geo_note_category,
    sub_category VARCHAR,
    comment TEXT,
    distance_meters DOUBLE PRECISION,
    expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.category,
        g.sub_category,
        g.comment,
        ST_Distance(g.location::geography, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) as distance_meters,
        g.expires_at
    FROM geo_notes g
    WHERE g.expires_at > NOW()
      AND ST_DWithin(
          g.location::geography,
          ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
          radius_meters
      )
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- 2. Finalize walk session: Build LineString from points array and calculate length in meters
-- Usage: SELECT finalize_walk_route('session_uuid', ARRAY[ST_MakePoint(...), ...]);
CREATE OR REPLACE FUNCTION finalize_walk_route(
    p_session_id UUID,
    p_points GEOMETRY[]
)
RETURNS VOID AS $$
DECLARE
    v_line GEOMETRY;
    v_length_meters DOUBLE PRECISION;
BEGIN
    -- Construct LineString from point array
    v_line := ST_SetSRID(ST_MakeLine(p_points), 4326);
    v_length_meters := ST_Length(v_line::geography);

    UPDATE walk_sessions
    SET route = v_line,
        distance_meters = v_length_meters,
        ended_at = NOW(),
        is_active = FALSE
    WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;
