-- Seed data for development
INSERT INTO maps (slug, name, min_zoom, max_zoom, bounds_json) VALUES
  ('customs',    'Customs',    -1, 3, '[[0,0],[1000,1000]]'),
  ('woods',      'Woods',      -1, 3, '[[0,0],[1000,1000]]'),
  ('interchange','Interchange',-1, 3, '[[0,0],[1000,1000]]'),
  ('shoreline',  'Shoreline',  -1, 3, '[[0,0],[1000,1000]]'),
  ('factory',    'Factory',     0, 3, '[[0,0],[1000,1000]]'),
  ('reserve',    'Reserve',    -1, 3, '[[0,0],[1000,1000]]')
ON CONFLICT (slug) DO NOTHING;
