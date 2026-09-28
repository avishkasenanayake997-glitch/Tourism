// Seeded catalog data for Places Microservice (Sri Lanka)
const DESTINATIONS = [
  {
    id: 'dest-sigiriya',
    name: 'Sigiriya & The Cultural Triangle',
    slug: 'sigiriya',
    short_description: 'Ancient rock fortress, fresco caves, and UNESCO heritage.',
    description: 'Sigiriya is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka. It is a site of historical and archaeological significance dominated by a massive column of rock nearly 200 metres high.',
    province: 'Central Province',
    district: 'Matale',
    latitude: 7.957,
    longitude: 80.7603,
    hero_image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    best_time_to_visit: 'December to April',
    estimated_budget: '$40 - $120 / day',
    category: 'Cultural Triangle',
    highlights: ['Lion Rock Citadel', 'Ancient Mirror Wall', 'Water Gardens', 'Pidurangala Sunrise'],
    vibe_tags: ['Heritage', 'Archaeology', 'Scenic Views', 'Adventure'],
    rating: 4.9,
    review_count: 1420,
    is_featured: true,
    is_hidden_gem: false
  },
  {
    id: 'dest-ella',
    name: 'Ella & The Central Highlands',
    slug: 'ella',
    short_description: 'Misty tea plantations, waterfalls, and iconic train viaducts.',
    description: 'Ella is a small hill town nestled in the Badulla District surrounded by emerald tea plantations, cloud forests, and breathtaking mountain gaps.',
    province: 'Uva Province',
    district: 'Badulla',
    latitude: 6.8667,
    longitude: 81.0466,
    hero_image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    best_time_to_visit: 'January to May',
    estimated_budget: '$30 - $90 / day',
    category: 'Hill Country',
    highlights: ['Nine Arches Bridge', 'Little Adams Peak', 'Ravana Falls', 'Tea Estate Hikes'],
    vibe_tags: ['Nature', 'Hiking', 'Misty', 'Relaxation'],
    rating: 4.8,
    review_count: 980,
    is_featured: true,
    is_hidden_gem: false
  },
  {
    id: 'dest-mirissa',
    name: 'Mirissa & Southern Coast',
    slug: 'mirissa',
    short_description: 'Golden crescent beaches, blue whale watching, and coconut hills.',
    description: 'Mirissa is one of the most idyllic coastal havens in Southern Sri Lanka, renowned for marine mammal safaris, pristine surf breaks, and fresh seafood.',
    province: 'Southern Province',
    district: 'Matara',
    latitude: 5.9483,
    longitude: 80.4716,
    hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    best_time_to_visit: 'November to April',
    estimated_budget: '$35 - $110 / day',
    category: 'Southern Coast',
    highlights: ['Blue Whale Watching', 'Coconut Tree Hill', 'Secret Beach', 'Sunset Surfing'],
    vibe_tags: ['Beach', 'Whale Watching', 'Nightlife', 'Seafood'],
    rating: 4.8,
    review_count: 870,
    is_featured: true,
    is_hidden_gem: false
  },
  {
    id: 'dest-yala',
    name: 'Yala National Park',
    slug: 'yala',
    short_description: 'Highest density of leopards in the world and wild elephant herds.',
    description: 'Yala National Park combines a strict nature reserve with a national park, hugging the Indian Ocean with pristine thorn forests and lagoons.',
    province: 'Southern / Uva Province',
    district: 'Hambantota',
    latitude: 6.368,
    longitude: 81.5273,
    hero_image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    best_time_to_visit: 'February to July',
    estimated_budget: '$80 - $250 / day',
    category: 'Wildlife Safari',
    highlights: ['Leopard Safaris', 'Elephant Gatherings', 'Sloth Bears', 'Coastal Lagoons'],
    vibe_tags: ['Wildlife', 'Safari', 'Photography', 'Raw Nature'],
    rating: 4.9,
    review_count: 1120,
    is_featured: false,
    is_hidden_gem: true
  }
];

const PLACES = [
  {
    id: 'place-sigiriya-rock',
    destination_id: 'dest-sigiriya',
    name: 'Sigiriya Lion Rock Citadel',
    description: 'King Kashyapa’s 5th-century sky palace crowned with monumental lion paws and celestial frescoes.',
    location: 'Sigiriya, Dambulla',
    latitude: 7.957,
    longitude: 80.7603,
    images: ['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'],
    category: 'Heritage',
    opening_hours: '07:00 AM - 05:30 PM',
    entry_fee: '$36 (Foreign) / LKR 100 (Local)',
    tips: 'Climb early in the morning around 7 AM to avoid heat and mid-day crowds.',
    rating: 4.9,
    review_count: 1250
  },
  {
    id: 'place-nine-arches',
    destination_id: 'dest-ella',
    name: 'Nine Arches Demodara Viaduct',
    description: 'A masterpiece of early 20th-century railway engineering built entirely of stone, brick, and cement without steel.',
    location: 'Demodara, Ella',
    latitude: 6.8778,
    longitude: 81.0608,
    images: ['https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'],
    category: 'Viewpoint',
    opening_hours: 'Open 24 Hours',
    entry_fee: 'Free',
    tips: 'Catch the blue passenger train crossing around 9:30 AM or 11:45 AM.',
    rating: 4.9,
    review_count: 890
  }
];

const EXPERIENCES = [
  {
    id: 'exp-yala-safari',
    destination_id: 'dest-yala',
    title: 'Dawn Leopard & Sloth Bear 4x4 Safari',
    description: 'Private open-top 4x4 safari led by an expert naturalist through Block 1 of Yala.',
    category: 'Wildlife',
    duration: '5 hours',
    price: '$75 per vehicle',
    images: ['https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80'],
    location: 'Palatupana Entrance, Yala',
    host_name: 'Dinesh Wickramasinghe (Field Naturalist)',
    inclusions: ['4x4 Safari Jeep', 'Park Tracker', 'Binoculars', 'Tropical Breakfast Pack'],
    rating: 4.9,
    review_count: 310
  }
];

const RESTAURANTS = [
  {
    id: 'rest-cafe-chill',
    destination_id: 'dest-ella',
    name: 'Cafe Chill Ella',
    description: 'Vibrant multilevel lounge serving artisanal burgers, traditional rice & curry pots, and fresh passion fruit mojitos.',
    cuisine: 'Fusion & Sri Lankan',
    price_range: '$$',
    location: 'Main Street, Ella',
    latitude: 6.8667,
    longitude: 81.0466,
    must_try: ['Lamprais in Banana Leaf', 'Woodfired Pizza', 'Arrack Sour'],
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
    review_count: 640
  }
];

const STAYS = [
  {
    id: 'stay-water-garden',
    destination_id: 'dest-sigiriya',
    name: 'Water Garden Sigiriya',
    description: 'Luxury villa sanctuary with private plunge pools overlooking the majestic Sigiriya Rock Fortress.',
    type: 'Boutique Hotel',
    price_range: '$$$',
    amenities: ['Private Plunge Pool', 'Ayurvedic Spa', 'Helipad', 'Fine Dining'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9,
    review_count: 230,
    location: 'Indigaswewa, Sigiriya'
  }
];

module.exports = {
  DESTINATIONS,
  PLACES,
  EXPERIENCES,
  RESTAURANTS,
  STAYS
};
