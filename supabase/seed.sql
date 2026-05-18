-- ============================================================
-- Ember — Seed Data
-- Run in the Supabase SQL editor (requires postgres / superuser)
--
-- profiles.id has a FK → auth.users(id). We bypass it with
-- session_replication_role so these seed profiles work without
-- real auth accounts (they cannot sign in).
--
-- NOTE ON PHOTOS
--   storage_path values are DiceBear SVG URLs, not Supabase
--   Storage paths. Avatars won't render with the default URL
--   builder until you either:
--     a) replace storage_path with real uploaded photo paths, or
--     b) update the URL builder to pass through full URLs:
--          storage_path.startsWith('http')
--            ? storage_path
--            : `${SUPABASE_URL}/storage/v1/object/public/photos/${storage_path}`
-- ============================================================

set session_replication_role = replica;


-- ----------------------------------------------------------------
-- 1. PROFILES
-- ----------------------------------------------------------------
insert into profiles (
  id, name, bio, age, city,
  identity, gender, seeking,
  age_min, age_max, subscription_status, onboarding_complete, created_at
) values
  ( '10000000-0000-0000-0000-000000000001', 'Sienna',
    'Basically allergic to bad coffee and Sunday scaries. Looking for someone to get lost on mountain trails with.',
    26, 'Denver, CO', 'redhead', 'woman', array['man','nonbinary'],
    23, 35, 'active', true, now() - interval '42 days' ),

  ( '10000000-0000-0000-0000-000000000002', 'Rowan',
    'Marine biologist by day, experimental chef by night. Fair warning: you may be asked to taste things.',
    28, 'Portland, OR', 'redhead', 'man', array['woman','nonbinary'],
    23, 36, 'active', true, now() - interval '38 days' ),

  ( '10000000-0000-0000-0000-000000000003', 'Fiona',
    'I work in a bookstore and have read approximately none of the books I sell. Still very happy to recommend them.',
    24, 'Austin, TX', 'redhead', 'woman', array['man'],
    22, 32, 'active', true, now() - interval '35 days' ),

  ( '10000000-0000-0000-0000-000000000004', 'Declan',
    'Youth soccer coach who shouts "great effort" more than is socially acceptable off the field.',
    31, 'Boston, MA', 'redhead', 'man', array['woman'],
    25, 38, 'active', true, now() - interval '30 days' ),

  ( '10000000-0000-0000-0000-000000000005', 'Maeve',
    'Pastry chef with strong opinions about butter and sourdough. My apartment always smells like something good.',
    27, 'Chicago, IL', 'redhead', 'woman', array['man','woman'],
    24, 35, 'active', true, now() - interval '28 days' ),

  ( '10000000-0000-0000-0000-000000000006', 'Cillian',
    'I build software for a living and half-finish side projects for fun. This profile may become one of them.',
    29, 'Seattle, WA', 'redhead', 'man', array['woman','nonbinary'],
    23, 35, 'active', true, now() - interval '25 days' ),

  ( '10000000-0000-0000-0000-000000000007', 'Aoife',
    'Musician who gigs on weekends and tutors kids on weekdays. I can teach you three chords in an hour.',
    25, 'Nashville, TN', 'redhead', 'woman', array['man'],
    23, 33, 'active', true, now() - interval '22 days' ),

  ( '10000000-0000-0000-0000-000000000008', 'Rory',
    'I own a restaurant and eat at other restaurants on my days off. An occupational hazard I''ve fully accepted.',
    30, 'San Francisco, CA', 'redhead', 'man', array['woman'],
    25, 38, 'active', true, now() - interval '20 days' ),

  ( '10000000-0000-0000-0000-000000000009', 'Clementine',
    'Art school grad now working in advertising. Send memes or good coffee recommendations.',
    23, 'Brooklyn, NY', 'redhead', 'woman', array['man','woman'],
    21, 32, 'active', true, now() - interval '18 days' ),

  ( '10000000-0000-0000-0000-000000000010', 'Lachlan',
    'ER doctor desperately searching for hobbies that don''t involve adrenaline. Progress is slow.',
    33, 'Philadelphia, PA', 'redhead', 'man', array['woman'],
    26, 40, 'active', true, now() - interval '15 days' ),

  ( '10000000-0000-0000-0000-000000000011', 'Brianna',
    'Yoga instructor who drinks red wine and watches reality TV. Containing multitudes over here.',
    22, 'Denver, CO', 'redhead', 'woman', array['man'],
    21, 30, 'active', true, now() - interval '14 days' ),

  ( '10000000-0000-0000-0000-000000000012', 'Fergus',
    'Freelance photographer, mostly landscapes, occasionally my dog. The dog photographs better.',
    34, 'Portland, OR', 'redhead', 'man', array['woman','nonbinary'],
    26, 40, 'active', true, now() - interval '12 days' ),

  ( '10000000-0000-0000-0000-000000000013', 'Jake',
    'Third grade teacher who will absolutely talk too much about his students. You''ve been warned.',
    29, 'Austin, TX', 'admirer', 'man', array['woman'],
    23, 35, 'active', true, now() - interval '40 days' ),

  ( '10000000-0000-0000-0000-000000000014', 'Priya',
    'Product manager, bad at directions, weirdly good at parallel parking. It all evens out.',
    27, 'New York, NY', 'admirer', 'woman', array['man'],
    24, 34, 'active', true, now() - interval '36 days' ),

  ( '10000000-0000-0000-0000-000000000015', 'Marcus',
    'Jazz pianist who moonlights as an accountant. The two things have nothing in common and I love that.',
    31, 'Los Angeles, CA', 'admirer', 'man', array['woman'],
    24, 38, 'active', true, now() - interval '33 days' ),

  ( '10000000-0000-0000-0000-000000000016', 'Zoe',
    'Veterinary student with four dogs I can''t afford. The dogs are not negotiable.',
    24, 'Chicago, IL', 'admirer', 'woman', array['man','nonbinary'],
    22, 32, 'active', true, now() - interval '27 days' ),

  ( '10000000-0000-0000-0000-000000000017', 'Eli',
    'High school history teacher who spends summers visiting battlefields. I know how it sounds.',
    28, 'Seattle, WA', 'admirer', 'man', array['woman'],
    22, 34, 'active', true, now() - interval '24 days' ),

  ( '10000000-0000-0000-0000-000000000018', 'Carmen',
    'Event planner who shows up 20 minutes early to everything and pretends it''s accidental.',
    26, 'Miami, FL', 'admirer', 'woman', array['man'],
    24, 34, 'active', true, now() - interval '21 days' ),

  ( '10000000-0000-0000-0000-000000000019', 'Tyler',
    'Bartender and part-time cocktail experimenter. The experiments don''t always work. That''s fine.',
    32, 'Nashville, TN', 'admirer', 'man', array['woman','man'],
    24, 40, 'active', true, now() - interval '16 days' ),

  ( '10000000-0000-0000-0000-000000000020', 'Ingrid',
    'Urban planner by day, ceramicist by evening. I own too many mugs and have no regrets.',
    30, 'Brooklyn, NY', 'admirer', 'woman', array['man','nonbinary'],
    25, 38, 'active', true, now() - interval '13 days' )

on conflict do nothing;


-- ----------------------------------------------------------------
-- 2. PHOTOS  (1 per profile — DiceBear avataaars SVG URLs)
-- ----------------------------------------------------------------
insert into photos (id, user_id, storage_path, display_order, created_at)
values
  ( '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sienna',    0, now() - interval '42 days' ),
  ( '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rowan',     0, now() - interval '38 days' ),
  ( '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona',     0, now() - interval '35 days' ),
  ( '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Declan',    0, now() - interval '30 days' ),
  ( '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maeve',     0, now() - interval '28 days' ),
  ( '20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Cillian',   0, now() - interval '25 days' ),
  ( '20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aoife',     0, now() - interval '22 days' ),
  ( '20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rory',      0, now() - interval '20 days' ),
  ( '20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Clementine',0, now() - interval '18 days' ),
  ( '20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000010',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lachlan',   0, now() - interval '15 days' ),
  ( '20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000011',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Brianna',   0, now() - interval '14 days' ),
  ( '20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Fergus',    0, now() - interval '12 days' ),
  ( '20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000013',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',      0, now() - interval '40 days' ),
  ( '20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000014',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',     0, now() - interval '36 days' ),
  ( '20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000015',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',    0, now() - interval '33 days' ),
  ( '20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000016',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',       0, now() - interval '27 days' ),
  ( '20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000017',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Eli',       0, now() - interval '24 days' ),
  ( '20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000018',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen',    0, now() - interval '21 days' ),
  ( '20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000019',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler',     0, now() - interval '16 days' ),
  ( '20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000020',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ingrid',    0, now() - interval '13 days' )

on conflict do nothing;


-- ----------------------------------------------------------------
-- 3. SWIPES
--
-- 15 mutual-like pairs (→ 15 matches)
-- 3 one-sided likes
-- 7 passes
-- No duplicate (swiper_id, swiped_id) pairs
-- ----------------------------------------------------------------
insert into swipes (id, swiper_id, swiped_id, direction, created_at)
values
  -- Pair 1: Sienna ↔ Jake  → match m01
  ( '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013',
    'like', now() - interval '3 days 1 hour' ),
  ( '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001',
    'like', now() - interval '3 days' ),

  -- Pair 2: Rowan ↔ Priya  → match m02
  ( '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000014',
    'like', now() - interval '2 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002',
    'like', now() - interval '2 days 1 hour' ),

  -- Pair 3: Fiona ↔ Jake  → match m03
  ( '30000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000013',
    'like', now() - interval '4 days 1 hour' ),
  ( '30000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000003',
    'like', now() - interval '4 days' ),

  -- Pair 4: Declan ↔ Priya  → match m04
  ( '30000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000014',
    'like', now() - interval '2 days 4 hours' ),
  ( '30000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000004',
    'like', now() - interval '2 days 3 hours' ),

  -- Pair 5: Maeve ↔ Marcus  → match m05
  ( '30000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015',
    'like', now() - interval '5 hours' ),
  ( '30000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000005',
    'like', now() - interval '4 hours 30 minutes' ),

  -- Pair 6: Cillian ↔ Zoe  → match m06
  ( '30000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000016',
    'like', now() - interval '7 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000006',
    'like', now() - interval '7 days 1 hour' ),

  -- Pair 7: Aoife ↔ Eli  → match m07
  ( '30000000-0000-0000-0000-000000000013',
    '10000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000017',
    'like', now() - interval '6 days 3 hours' ),
  ( '30000000-0000-0000-0000-000000000014',
    '10000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000007',
    'like', now() - interval '6 days 2 hours' ),

  -- Pair 8: Rory ↔ Carmen  → match m08
  ( '30000000-0000-0000-0000-000000000015',
    '10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000018',
    'like', now() - interval '8 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000016',
    '10000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000008',
    'like', now() - interval '8 days 1 hour' ),

  -- Pair 9: Clementine ↔ Tyler  → match m09
  ( '30000000-0000-0000-0000-000000000017',
    '10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000019',
    'like', now() - interval '40 minutes' ),
  ( '30000000-0000-0000-0000-000000000018',
    '10000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000009',
    'like', now() - interval '35 minutes' ),

  -- Pair 10: Lachlan ↔ Ingrid  → match m10
  ( '30000000-0000-0000-0000-000000000019',
    '10000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000020',
    'like', now() - interval '11 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000020',
    '10000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000010',
    'like', now() - interval '11 days 1 hour' ),

  -- Pair 11: Brianna ↔ Marcus  → match m11
  ( '30000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000015',
    'like', now() - interval '9 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000022',
    '10000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000011',
    'like', now() - interval '9 days 1 hour' ),

  -- Pair 12: Fergus ↔ Zoe  → match m12
  ( '30000000-0000-0000-0000-000000000023',
    '10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000016',
    'like', now() - interval '10 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000024',
    '10000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000012',
    'like', now() - interval '10 days 1 hour' ),

  -- Pair 13: Sienna ↔ Eli  → match m13
  ( '30000000-0000-0000-0000-000000000025',
    '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000017',
    'like', now() - interval '5 days 2 hours' ),
  ( '30000000-0000-0000-0000-000000000026',
    '10000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000001',
    'like', now() - interval '5 days 1 hour' ),

  -- Pair 14: Rowan ↔ Carmen  → match m14
  ( '30000000-0000-0000-0000-000000000027',
    '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000018',
    'like', now() - interval '3 days 3 hours' ),
  ( '30000000-0000-0000-0000-000000000028',
    '10000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000002',
    'like', now() - interval '3 days 2 hours' ),

  -- Pair 15: Maeve ↔ Ingrid  → match m15
  ( '30000000-0000-0000-0000-000000000029',
    '10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000020',
    'like', now() - interval '6 hours' ),
  ( '30000000-0000-0000-0000-000000000030',
    '10000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000005',
    'like', now() - interval '5 hours 30 minutes' ),

  -- One-sided likes (no reciprocation)
  ( '30000000-0000-0000-0000-000000000031',
    '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000015',
    'like', now() - interval '5 days' ),
  ( '30000000-0000-0000-0000-000000000032',
    '10000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000016',
    'like', now() - interval '4 days' ),
  ( '30000000-0000-0000-0000-000000000033',
    '10000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000019',
    'like', now() - interval '6 days' ),

  -- Passes
  ( '30000000-0000-0000-0000-000000000034',
    '10000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000003',
    'pass', now() - interval '5 days' ),
  ( '30000000-0000-0000-0000-000000000035',
    '10000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000004',
    'pass', now() - interval '4 days' ),
  ( '30000000-0000-0000-0000-000000000036',
    '10000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000007',
    'pass', now() - interval '6 days' ),
  ( '30000000-0000-0000-0000-000000000037',
    '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000015',
    'pass', now() - interval '6 days' ),
  ( '30000000-0000-0000-0000-000000000038',
    '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000016',
    'pass', now() - interval '5 days' ),
  ( '30000000-0000-0000-0000-000000000039',
    '10000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000014',
    'pass', now() - interval '7 days' ),
  ( '30000000-0000-0000-0000-000000000040',
    '10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000015',
    'pass', now() - interval '9 days' )

on conflict do nothing;


-- ----------------------------------------------------------------
-- 4. MATCHES
-- user_a is always the lexicographically smaller UUID.
-- All 15 mutual-like pairs from above.
-- ----------------------------------------------------------------
insert into matches (id, user_a, user_b, created_at)
values
  ( '40000000-0000-0000-0000-000000000001',  -- m01: Sienna ↔ Jake
    '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013',
    now() - interval '3 days' ),

  ( '40000000-0000-0000-0000-000000000002',  -- m02: Rowan ↔ Priya
    '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000014',
    now() - interval '2 days' ),

  ( '40000000-0000-0000-0000-000000000003',  -- m03: Fiona ↔ Jake
    '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000013',
    now() - interval '4 days' ),

  ( '40000000-0000-0000-0000-000000000004',  -- m04: Declan ↔ Priya
    '10000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000014',
    now() - interval '2 days' ),

  ( '40000000-0000-0000-0000-000000000005',  -- m05: Maeve ↔ Marcus
    '10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015',
    now() - interval '4 hours' ),

  ( '40000000-0000-0000-0000-000000000006',  -- m06: Cillian ↔ Zoe
    '10000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000016',
    now() - interval '7 days' ),

  ( '40000000-0000-0000-0000-000000000007',  -- m07: Aoife ↔ Eli
    '10000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000017',
    now() - interval '6 days' ),

  ( '40000000-0000-0000-0000-000000000008',  -- m08: Rory ↔ Carmen
    '10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000018',
    now() - interval '8 days' ),

  ( '40000000-0000-0000-0000-000000000009',  -- m09: Clementine ↔ Tyler
    '10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000019',
    now() - interval '32 minutes' ),

  ( '40000000-0000-0000-0000-000000000010',  -- m10: Lachlan ↔ Ingrid
    '10000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000020',
    now() - interval '11 days' ),

  ( '40000000-0000-0000-0000-000000000011',  -- m11: Brianna ↔ Marcus
    '10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000015',
    now() - interval '9 days' ),

  ( '40000000-0000-0000-0000-000000000012',  -- m12: Fergus ↔ Zoe
    '10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000016',
    now() - interval '10 days' ),

  ( '40000000-0000-0000-0000-000000000013',  -- m13: Sienna ↔ Eli
    '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000017',
    now() - interval '5 days' ),

  ( '40000000-0000-0000-0000-000000000014',  -- m14: Rowan ↔ Carmen
    '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000018',
    now() - interval '3 days' ),

  ( '40000000-0000-0000-0000-000000000015',  -- m15: Maeve ↔ Ingrid
    '10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000020',
    now() - interval '5 hours' )

on conflict do nothing;


-- ----------------------------------------------------------------
-- 5. MESSAGES  (5 active conversations, 5-6 messages each)
-- read = false means the recipient has not yet opened the message.
-- ----------------------------------------------------------------
insert into messages (id, match_id, sender_id, content, read, created_at)
values

  -- ── m01: Sienna (p01) ↔ Jake (p13) ─────────────────────────
  --    Jake initiated · 2 days ago · both caught up (all read)
  ( '50000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013',
    'Hey Sienna! Your bio about hikes and bad coffee had me at both honestly',
    true, now() - interval '2 days 4 hours' ),
  ( '50000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
    'Lol the bar was on the floor and you still cleared it. What trail would you take me on first?',
    true, now() - interval '2 days 3 hours 45 minutes' ),
  ( '50000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013',
    'There''s this loop near Red Rocks that''s hard enough to feel accomplished but easy enough to still talk',
    true, now() - interval '2 days 3 hours 30 minutes' ),
  ( '50000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
    'Okay that''s exactly the right level of ambition. Saturday morning?',
    true, now() - interval '2 days 3 hours' ),
  ( '50000000-0000-0000-0000-000000000005',
    '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013',
    'I''ll bring the good coffee as a peace offering for all the bad ones',
    true, now() - interval '2 days 2 hours 50 minutes' ),
  ( '50000000-0000-0000-0000-000000000006',
    '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
    'Deal. Now I actually have a reason to wake up before 9',
    true, now() - interval '2 days 2 hours 30 minutes' ),

  -- ── m02: Rowan (p02) ↔ Priya (p14) ─────────────────────────
  --    Rowan initiated · 1 day ago · Rowan's last message unread by Priya
  ( '50000000-0000-0000-0000-000000000007',
    '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
    'Marine biologist to product manager feels like there''s a crossover episode somewhere',
    true, now() - interval '1 day 2 hours' ),
  ( '50000000-0000-0000-0000-000000000008',
    '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000014',
    'Both involve wrangling things that don''t want to be wrangled. More in common than you''d think',
    true, now() - interval '1 day 1 hour 50 minutes' ),
  ( '50000000-0000-0000-0000-000000000009',
    '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
    'Okay that''s a very good answer. Fair warning I will probably cook for you and it will be experimental',
    true, now() - interval '1 day 1 hour 30 minutes' ),
  ( '50000000-0000-0000-0000-000000000010',
    '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000014',
    'I have eaten at startups for years, my stomach is basically a beta tester',
    true, now() - interval '1 day 1 hour' ),
  ( '50000000-0000-0000-0000-000000000011',
    '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
    'This is going well',
    false, now() - interval '50 minutes' ),

  -- ── m05: Maeve (p05) ↔ Marcus (p15) ────────────────────────
  --    Marcus initiated · ~3 hours ago · Maeve's last message unread by Marcus
  ( '50000000-0000-0000-0000-000000000012',
    '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015',
    'A pastry chef and a jazz pianist walk into a bar... this feels like the setup to something',
    true, now() - interval '3 hours 30 minutes' ),
  ( '50000000-0000-0000-0000-000000000013',
    '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005',
    'The punchline is they both work weird hours and eat dinner at 11pm',
    true, now() - interval '3 hours 20 minutes' ),
  ( '50000000-0000-0000-0000-000000000014',
    '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015',
    'Okay accurate. Do you do savory too or is it all sweets?',
    true, now() - interval '3 hours 10 minutes' ),
  ( '50000000-0000-0000-0000-000000000015',
    '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005',
    'I can cook but baking is my love language. What''s your go-to after a late set?',
    true, now() - interval '3 hours' ),
  ( '50000000-0000-0000-0000-000000000016',
    '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015',
    'Honestly? Whatever the closest diner is. I''m not picky after midnight',
    true, now() - interval '2 hours 45 minutes' ),
  ( '50000000-0000-0000-0000-000000000017',
    '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005',
    'I have strong opinions about this and will absolutely change your standards',
    false, now() - interval '2 hours 30 minutes' ),

  -- ── m07: Aoife (p07) ↔ Eli (p17) ───────────────────────────
  --    Aoife initiated · 5 days ago · both caught up (all read)
  ( '50000000-0000-0000-0000-000000000018',
    '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007',
    'A history teacher who visits battlefields on vacation, huh. I promise not to make a judgment',
    true, now() - interval '5 days 6 hours' ),
  ( '50000000-0000-0000-0000-000000000019',
    '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000017',
    'Thank you I get enough from my students. Do you play original stuff or covers?',
    true, now() - interval '5 days 5 hours 45 minutes' ),
  ( '50000000-0000-0000-0000-000000000020',
    '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007',
    'Both — started with covers, got confident enough to write my own. What period do you specialize in?',
    true, now() - interval '5 days 5 hours 30 minutes' ),
  ( '50000000-0000-0000-0000-000000000021',
    '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000017',
    'Mostly 20th century, WWI through Cold War. I know it''s heavy',
    true, now() - interval '5 days 5 hours' ),
  ( '50000000-0000-0000-0000-000000000022',
    '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007',
    'No I think that''s fascinating. My grandad had stories from the Troubles. Different but the same weight',
    true, now() - interval '5 days 4 hours 45 minutes' ),
  ( '50000000-0000-0000-0000-000000000023',
    '40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000017',
    'I''d really like to hear those if you''d ever want to share them',
    true, now() - interval '5 days 4 hours' ),

  -- ── m09: Clementine (p09) ↔ Tyler (p19) ────────────────────
  --    Tyler initiated · ~30 min ago · Clementine's last message unread by Tyler
  ( '50000000-0000-0000-0000-000000000024',
    '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000019',
    'Art school grad in advertising — is that selling out or leveling up? I genuinely want your take',
    true, now() - interval '28 minutes' ),
  ( '50000000-0000-0000-0000-000000000025',
    '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009',
    'Depends on the day honestly. Today it feels like leveling up. Yesterday not so much',
    true, now() - interval '24 minutes' ),
  ( '50000000-0000-0000-0000-000000000026',
    '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000019',
    'Sounds like bartending. Some shifts feel like performance art, some feel like crowd control',
    true, now() - interval '20 minutes' ),
  ( '50000000-0000-0000-0000-000000000027',
    '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009',
    'That''s actually kind of a great parallel. Do you make up drinks or stick to classics?',
    true, now() - interval '15 minutes' ),
  ( '50000000-0000-0000-0000-000000000028',
    '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000019',
    'I have a notebook full of experiments that never made it on the menu',
    true, now() - interval '10 minutes' ),
  ( '50000000-0000-0000-0000-000000000029',
    '40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009',
    'That''s the most interesting thing anyone''s said to me on here. Show me some of these failures?',
    false, now() - interval '5 minutes' )

on conflict do nothing;


-- Restore FK enforcement
set session_replication_role = default;
