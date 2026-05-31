-- ============================================================
-- Tarkov Map — initial schema
-- Запустіть після `prisma migrate deploy` або вручну в Supabase SQL Editor
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username  TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Maps
CREATE TABLE IF NOT EXISTS maps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  min_zoom    INT NOT NULL DEFAULT 2,
  max_zoom    INT NOT NULL DEFAULT 6,
  bounds_json TEXT NOT NULL
);

-- Squads
CREATE TABLE IF NOT EXISTS squads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  owner_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Squad members
CREATE TABLE IF NOT EXISTS squad_members (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id  UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role      TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'MEMBER')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (squad_id, user_id)
);

-- Squad markers (realtime)
CREATE TABLE IF NOT EXISTS squad_markers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id     UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  map_id       TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('ENEMY','LOOT','MEETING','DANGER','CUSTOM')),
  label        TEXT,
  lat          DOUBLE PRECISION NOT NULL,
  lng          DOUBLE PRECISION NOT NULL,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ NOT NULL
);

-- ============================================================
-- RLS policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_markers ENABLE ROW LEVEL SECURITY;

-- Profiles: everyone can read, only owner can update
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Squads: only members can read
CREATE POLICY "squads_select" ON squads FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM squad_members
    WHERE squad_members.squad_id = squads.id
      AND squad_members.user_id = auth.uid()
  ));
CREATE POLICY "squads_insert" ON squads FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "squads_delete" ON squads FOR DELETE USING (auth.uid() = owner_id);

-- Squad members: members can read their squad, owner can manage
CREATE POLICY "squad_members_select" ON squad_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM squad_members sm2
    WHERE sm2.squad_id = squad_members.squad_id AND sm2.user_id = auth.uid()
  ));
CREATE POLICY "squad_members_insert" ON squad_members FOR INSERT
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM squads WHERE id = squad_id AND owner_id = auth.uid()
  ));
CREATE POLICY "squad_members_delete" ON squad_members FOR DELETE
  USING (auth.uid() = user_id);

-- Squad markers: squad members can read/insert, creator can delete
CREATE POLICY "squad_markers_select" ON squad_markers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM squad_members
    WHERE squad_members.squad_id = squad_markers.squad_id
      AND squad_members.user_id = auth.uid()
  ));
CREATE POLICY "squad_markers_insert" ON squad_markers FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM squad_members
      WHERE squad_members.squad_id = squad_markers.squad_id
        AND squad_members.user_id = auth.uid()
    )
  );
CREATE POLICY "squad_markers_delete" ON squad_markers FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================
-- Auto-create profile on signup trigger
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Auto-delete expired markers (run via pg_cron or Supabase Edge Function)
-- ============================================================
CREATE OR REPLACE FUNCTION delete_expired_markers()
RETURNS void AS $$
BEGIN
  DELETE FROM squad_markers WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Enable Realtime on squad_markers
-- Run in Supabase Dashboard → Database → Replication → Tables
-- OR via SQL:
-- ============================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE squad_markers;
