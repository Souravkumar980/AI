-- ===================================================================
-- EXPOSED PROPAGANDUS - Cloudflare D1 SQLite Database Schema
-- File: d1-schema.sql
-- Use with Cloudflare Workers D1 Database:
--   npx wrangler d1 execute DB --file=d1-schema.sql
-- Bharat Mata ki Jai 🇮🇳
-- ===================================================================

-- 1. Tracked Propagandus Entities
CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle_x TEXT,
  handle_yt TEXT,
  handle_insta TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  other_links TEXT,
  avatar_url TEXT,
  categories TEXT NOT NULL DEFAULT 'General Disinformation',
  party TEXT,
  institution TEXT,
  narrative TEXT NOT NULL,
  fact_check TEXT,
  proof_url TEXT,
  upvotes INTEGER NOT NULL DEFAULT 1,
  rating_avg REAL NOT NULL DEFAULT 5.0,
  rating_count INTEGER NOT NULL DEFAULT 1,
  is_verified INTEGER NOT NULL DEFAULT 1,
  submitted_by_ip TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entities_wanted_rank ON entities(rating_avg DESC, rating_count DESC);
CREATE INDEX IF NOT EXISTS idx_entities_upvotes ON entities(upvotes DESC);

-- 2. IP-Unique 5-Star Wanted Level Ratings
CREATE TABLE IF NOT EXISTS propagandu_ratings (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(entity_id, ip_address)
);

CREATE INDEX IF NOT EXISTS idx_ratings_entity ON propagandu_ratings(entity_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ip ON propagandu_ratings(ip_address);

-- 3. Patriotic Nationalist Creators
CREATE TABLE IF NOT EXISTS nationalist_influencers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle_x TEXT,
  handle_yt TEXT,
  handle_insta TEXT,
  other_links TEXT,
  avatar_url TEXT,
  category TEXT DEFAULT 'Nationalist Creator',
  categories TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved',
  is_verified INTEGER NOT NULL DEFAULT 1,
  upvotes INTEGER NOT NULL DEFAULT 1,
  suggested_by_ip TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nationalists_upvotes ON nationalist_influencers(upvotes DESC);

-- 4. Admin Dispatches & Ground Bulletins
CREATE TABLE IF NOT EXISTS admin_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  badge TEXT DEFAULT 'DISPATCH',
  is_pinned INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  author TEXT DEFAULT 'Om Kumar (Admin)',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_posts_pinned ON admin_posts(is_pinned DESC, created_at DESC);

-- 5. Categories Directory
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'propagandist',
  count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 6. Citizen Reports
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  contact TEXT,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);

-- 7. Citizen Feature & Update Suggestions
CREATE TABLE IF NOT EXISTS feature_suggestions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending',
  upvotes INTEGER NOT NULL DEFAULT 0,
  submitted_by_ip TEXT,
  created_at TEXT NOT NULL
);

-- 8. Community Registered Users
CREATE TABLE IF NOT EXISTS community_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  verified_type TEXT DEFAULT 'none',
  is_admin INTEGER NOT NULL DEFAULT 0,
  is_banned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 9. Community Channels
CREATE TABLE IF NOT EXISTS community_channels (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_username TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  join_token TEXT NOT NULL UNIQUE,
  is_private INTEGER NOT NULL DEFAULT 0,
  members_json TEXT,
  pending_requests_json TEXT,
  created_at TEXT NOT NULL
);

-- 10. Community Messages
CREATE TABLE IF NOT EXISTS community_messages (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL DEFAULT 'chan_public',
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  reactions_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comm_messages_chan ON community_messages(channel_id, created_at);

-- 11. Global App Key-Value Store (for settings, polls, traffic, announcements)
CREATE TABLE IF NOT EXISTS site_kv_store (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Initial Categories Seed
INSERT OR IGNORE INTO categories (id, name, type, count, created_at) VALUES
('cat-1', 'Leftist Media Houses', 'propagandist', 0, '2026-10-14T00:00:00.000Z'),
('cat-2', 'Foreign-Funded NGOs', 'propagandist', 0, '2026-10-14T00:00:00.000Z'),
('cat-3', 'Social Media Influencers', 'propagandist', 0, '2026-10-14T00:00:00.000Z'),
('cat-4', 'Political Operatives', 'propagandist', 0, '2026-10-14T00:00:00.000Z'),
('cat-5', 'Separatist Narratives', 'propagandist', 0, '2026-10-14T00:00:00.000Z'),
('cat-6', 'Academic Bias', 'propagandist', 0, '2026-10-14T00:00:00.000Z');
