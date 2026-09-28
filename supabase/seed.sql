-- ==============================================================================
-- Lankora: Rich Sri Lankan Seed Data
-- ==============================================================================

-- Insert Destinations
INSERT INTO public.destinations (
  id, name, slug, short_description, description, province, district, latitude, longitude,
  hero_image, gallery, best_time_to_visit, estimated_budget, category, highlights, vibe_tags,
  rating, review_count, is_featured, is_hidden_gem
) VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'Ella',
  'ella',
  'Misty hill country paradise with emerald tea terraces and dramatic mountain gaps.',
  'Nestled in the central highlands of Sri Lanka, Ella is a tranquil sanctuary perched at 1,041 meters above sea level. Famed for its misty mornings, world-renowned Nine Arch Bridge, hiking ridges, and bohemian mountain cafes, Ella offers travelers a refreshing climate, cascading waterfalls, and breathtaking vistas over the Southern Plains through Ella Gap.',
  'Uva Province',
  'Badulla',
  6.8667,
  81.0466,
  'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  ],
  'December to April',
  '$45 - $85 / day',
  'Hill Country',
  ARRAY['Nine Arch Bridge sunrise', 'Little Adams Peak trek', 'Ravana Falls swim', 'Scenic blue train crossing'],
  ARRAY['Misty', 'Hiking', 'Tea Plantations', 'Chill Vibes'],
  4.9,
  342,
  true,
  false
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Sigiriya',
  'sigiriya',
  'The ancient 5th-century Lion Rock fortress rising sheer out of the jungle canopy.',
  'Sigiriya is an UNESCO World Heritage wonder and ancient royal citadel built atop a monolithic 200-meter granite rock by King Kashyapa. Wander through the world''s oldest landscaped water gardens, marvel at celestial fresco maiden paintings, climb through the gigantic lion paws, and watch twilight settle over the unbroken wilderness.',
  'Central Province',
  'Matale',
  7.9570,
  80.7603,
  'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
  ],
  'January to April',
  '$50 - $110 / day',
  'Cultural Triangle',
  ARRAY['Lion Rock fortress climb', 'Pidurangala sunrise panorama', 'Ancient water gardens', 'Fresco gallery'],
  ARRAY['UNESCO', 'Ancient History', 'Epic Vistas', 'Wonder'],
  4.9,
  512,
  true,
  false
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Galle Fort',
  'galle',
  'Living 17th-century Dutch colonial ramparts, ocean bastions, and cobblestone alleyways.',
  'Enclosed by colossal granite sea walls that withstood centuries and tsunamis, Galle Fort is a living colonial monument where European architecture harmonizes with warm tropical island soul. Discover artisan boutique jewelers, gelato spots, Dutch Reformed churches, and incandescent sunsets from the historic Lighthouse.',
  'Southern Province',
  'Galle',
  6.0329,
  80.2168,
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  ],
  'October to April',
  '$60 - $140 / day',
  'Southern Coast',
  ARRAY['Lighthouse twilight stroll', 'Rampart ocean walk', 'Colonial architecture', 'Gourmet coastal dining'],
  ARRAY['Colonial', 'Romance', 'Ocean Breeze', 'Artisan'],
  4.8,
  420,
  true,
  false
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Mirissa',
  'mirissa',
  'Crescent golden sand bays, coconut palm headlands, and blue whale ocean safaris.',
  'Mirissa embodies the laid-back rhythm of tropical Sri Lanka. By day, witness gigantic blue whales migrating along the southern maritime shelf, climb iconic Coconut Tree Hill for idyllic panorama views, or surf the clean reef breaks. As twilight arrives, beachfront tables illuminate with candle lanterns and fresh catch of the day.',
  'Southern Province',
  'Matara',
  5.9483,
  80.4578,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
  ],
  'November to April',
  '$40 - $80 / day',
  'Southern Coast',
  ARRAY['Blue whale watching safari', 'Coconut Tree Hill sunrise', 'Parrot Rock viewpoint', 'Seafood BBQs on the sand'],
  ARRAY['Beach Life', 'Whales', 'Surfing', 'Golden Sands'],
  4.8,
  290,
  true,
  false
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Kandy',
  'kandy',
  'Sacred highland kingdom surrounding a reflective lake, home to the Tooth of the Buddha.',
  'The last capital of the ancient kings, Kandy rests peacefully amidst mist-shrouded green hills. Anchored by the revered Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) and surrounded by the royal botanical gardens of Peradeniya, Kandy is the spiritual and cultural heart of Sri Lanka.',
  'Central Province',
  'Kandy',
  7.2906,
  80.6337,
  'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'],
  'December to April',
  '$40 - $90 / day',
  'Cultural Triangle',
  ARRAY['Temple of the Tooth Relic ceremony', 'Peradeniya Royal Botanical Gardens', 'Kandy Lake loop', 'Traditional Kandyan drummers'],
  ARRAY['Spiritual', 'Kingdom', 'Sacred', 'Culture'],
  4.7,
  380,
  false,
  false
),
(
  'a6666666-6666-6666-6666-666666666666',
  'Yala National Park',
  'yala',
  'Untamed scrub jungle boasting the highest leopard density in the world.',
  'Where arid savanna meets the roaring Indian Ocean, Yala is Sri Lanka''s premier wildlife sanctuary. Safari open-top jeeps traverse red dirt tracks to encounter elusive Sri Lankan leopards (Panthera pardus kotiya), majestic elephant herds, sloth bears, marsh crocodiles, and hundreds of avian species.',
  'Southern / Uva',
  'Hambantota',
  6.3725,
  81.5170,
  'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80'],
  'February to June',
  '$90 - $220 / day',
  'Wildlife Safari',
  ARRAY['Leopard dawn tracking', 'Wild elephant herds', 'Ocean-view safari camp', 'Birdwatching wetlands'],
  ARRAY['Wildlife', 'Safari', 'Leopards', 'Untamed'],
  4.9,
  460,
  true,
  false
),
(
  'a7777777-7777-7777-7777-777777777777',
  'Arugam Bay',
  'arugam-bay',
  'Legendary right-hand point break surf capital and bohemian eastern haven.',
  'Ranked among the top surf destinations on earth, "A-Bay" presents a relaxed, soul-filled community. Swept by monsoon winds that create machine-like peeling right-hand waves at Main Point and Whiskey Point, the town blends surf culture with lagoon safaris where wild elephants graze beside the waterways.',
  'Eastern Province',
  'Ampara',
  6.8436,
  81.8344,
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
  'May to September',
  '$35 - $75 / day',
  'Eastern Coast',
  ARRAY['Main Point barrel surf', 'Kottukal lagoon elephant safari', 'Panama sand dunes', 'Sunset bonfires'],
  ARRAY['Surfing', 'Free Spirit', 'Point Break', 'Sunsets'],
  4.8,
  210,
  false,
  true
),
(
  'a8888888-8888-8888-8888-888888888888',
  'Nuwara Eliya',
  'nuwara-eliya',
  '"Little England" nestled in cool alpine tea estates and Victorian rose gardens.',
  'Sitting in the shadow of Mount Pidurutalagala at 1,868m elevation, Nuwara Eliya is characterized by crisp alpine mountain air, manicured Ceylon tea estates, red-brick post offices, Tudor-style mansions, and boating on Lake Gregory.',
  'Central Province',
  'Nuwara Eliya',
  6.9497,
  80.7891,
  'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'],
  'March to May',
  '$55 - $120 / day',
  'Hill Country',
  ARRAY['High tea at The Grand Hotel', 'Pedro Tea Estate tour', 'Horton Plains & World''s End cliff', 'Lake Gregory sailing'],
  ARRAY['Alpine', 'Pure Ceylon Tea', 'Colonial', 'Misty'],
  4.7,
  310,
  false,
  false
);

-- Insert Places
INSERT INTO public.places (
  id, destination_id, name, description, location, latitude, longitude,
  images, category, opening_hours, entry_fee, tips, rating, review_count
) VALUES
(
  'b1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'Nine Arch Bridge',
  'A colonial architectural triumph built entirely of brick, stone, and cement without a single piece of steel, bridging dense rainforest jungle.',
  'Demodara, Ella',
  6.8767,
  81.0608,
  ARRAY['https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'],
  'Heritage',
  'Open 24/7',
  'Free',
  'Arrive around 9:15 AM or 11:45 AM to watch the blue passenger train rumble across the stone arches.',
  4.9,
  640
),
(
  'b2222222-2222-2222-2222-222222222222',
  'a2222222-2222-2222-2222-222222222222',
  'Pidurangala Rock',
  'The neighboring volcanic rock offering the most dramatic unobstructed 360-degree viewpoint directly facing the Lion Rock fortress.',
  'Sigiriya',
  7.9650,
  80.7630,
  ARRAY['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'],
  'Viewpoint',
  '5:00 AM - 6:00 PM',
  'LKR 1,000 (~$3)',
  'Start climbing at 5:00 AM with a headlamp to catch dawn illumination across Sigiriya.',
  4.9,
  480
),
(
  'b3333333-3333-3333-3333-333333333333',
  'a3333333-3333-3333-3333-333333333333',
  'Galle Fort Lighthouse',
  'The pristine white lighthouse built in 1939 standing proud on the Point Utrecht Bastion, framed by majestic palm trees against the Laccadive Sea.',
  'Ramparts, Galle Fort',
  6.0267,
  80.2174,
  ARRAY['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'],
  'Heritage',
  'Open 24/7',
  'Free',
  'Best visited at sunset when local families and travelers gather on the bastions.',
  4.8,
  350
),
(
  'b4444444-4444-4444-4444-444444444444',
  'a4444444-4444-4444-4444-444444444444',
  'Coconut Tree Hill',
  'A picturesque reddish-terracotta cliff overlooking the ocean with a cluster of swaying coconut palms.',
  'Mirissa East',
  5.9442,
  80.4632,
  ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
  'Viewpoint',
  'Open 24/7',
  'Free',
  'Visit at first light (6:15 AM) to have the magical promontory completely to yourself.',
  4.8,
  410
);

-- Insert Experiences
INSERT INTO public.experiences (
  id, destination_id, title, description, category, duration, price,
  images, location, host_name, inclusions, rating, review_count
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'Scenic Hill Country Blue Train Journey',
  'Hang out the open doorway as the iconic blue locomotive winds through high-altitude tea plantations, cloud forests, and mountain viaducts.',
  'Adventure',
  '3.5 hours',
  '$15 / ticket',
  ARRAY['https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'],
  'Nanu Oya to Ella',
  'Sri Lanka Railways & Local Porter',
  ARRAY['Reserved 2nd class window seat', 'Chai & short-eats', 'Luggage transfer'],
  4.9,
  890
),
(
  'c2222222-2222-2222-2222-222222222222',
  'a6666666-6666-6666-6666-666666666666',
  'Dawn Leopard & Wildlife Safari in Yala',
  'Private open 4x4 safari with a dedicated naturalist tracker searching for the elusive Sri Lankan leopard, sloth bears, and wild tuskers.',
  'Wildlife',
  'Full Day (6:00 AM - 5:00 PM)',
  '$95 / person',
  ARRAY['https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80'],
  'Yala Block 1, Palatupana',
  'Naturalist Janaka Perera',
  ARRAY['4x4 Safari Jeep', 'Park entrance permit', 'Binoculars', 'Bush picnic breakfast & lunch'],
  4.9,
  380
),
(
  'c3333333-3333-3333-3333-333333333333',
  'a3333333-3333-3333-3333-333333333333',
  'Colonial Spice Trail & Traditional Clay Pot Cooking',
  'Walk through a family spice grove plucking wild cinnamon bark and cardamom, then master grinding roasted curry powder in a rural clay-pot kitchen.',
  'Culinary',
  '4 hours',
  '$38 / person',
  ARRAY['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'],
  'Unawatuna Spice Valley',
  'Amma Malini',
  ARRAY['7-curry organic lunch', 'Fresh coconut scraping', 'Recipe booklet', 'Spices gift pack'],
  5.0,
  240
);

-- Insert Restaurants
INSERT INTO public.restaurants (
  id, destination_id, name, description, cuisine, price_range,
  location, must_try, images, rating, review_count
) VALUES
(
  'd1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'Cafe Chill Ella',
  'A celebrated multi-level bamboo sanctuary serving fusion Ceylon comfort dishes, wood-fired pizzas, and fresh passion fruit smoothies.',
  'Ceylon Fusion & Cafe',
  '$$',
  'Main Street, Ella',
  ARRAY['Ella Special Lamprais', 'Pol Roti burger', 'Passion fruit mojito'],
  ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
  4.8,
  520
),
(
  'd2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'The Fort Printers',
  'Historic 18th-century mansion courtyard serving fresh grilled yellowfin tuna, coconut lemongrass curry, and heritage wines.',
  'Fine Coastal Dining',
  '$$$',
  'Pedlar Street, Galle Fort',
  ARRAY['Seared Sesame Tuna', 'Crab ravioli with Lankan bisque', 'Jaggery tart'],
  ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
  4.9,
  290
);

-- Insert Stays
INSERT INTO public.stays (
  id, destination_id, name, description, type, price_range,
  amenities, images, rating, review_count, location
) VALUES
(
  'e1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  '98 Acres Resort & Spa',
  'An ultra-luxury eco-paradise perched on a scenic 98-acre tea estate directly fronting the Ella Gap and Little Adams Peak.',
  'Eco-Lodge',
  '$190 - $380 / night',
  ARRAY['Infinity mountain pool', 'Tea spa', 'Helipad', 'Panoramic balconies', 'Organic farm dining'],
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
  4.9,
  310,
  'Passara Road, Ella'
),
(
  'e2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'Amangalla',
  'Living grand dame within Galle Fort, featuring 300-year-old teak floors, antique four-poster beds, and the legendary Zaal veranda.',
  'Colonial Villa',
  '$350 - $750 / night',
  ARRAY['Historic hydrotherapy baths', 'Tropical garden pool', 'Library bar', 'Butler service'],
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
  5.0,
  180,
  'Church Street, Galle Fort'
);
