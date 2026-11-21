CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  client TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  deliverables TEXT NOT NULL DEFAULT '[]',
  process TEXT NOT NULL DEFAULT '[]',
  blocks TEXT NOT NULL DEFAULT '[]',
  cover_url TEXT,
  cover_path TEXT,
  cover_alt TEXT NOT NULL DEFAULT '',
  cover_width INTEGER,
  cover_height INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  publish_at TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_publish_at ON projects(publish_at);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);
