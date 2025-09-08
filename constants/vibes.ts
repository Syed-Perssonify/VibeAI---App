import { PersonalityType, VibeType } from '@/types/user';

export const VIBE_TYPES: VibeType[] = [
  {
    id: 'adventure',
    name: 'Adventure Seeker',
    description: 'Loves outdoor activities and thrilling experiences',
    ageGroups: ['18-25', '26-35'],
    keywords: ['hiking', 'rock climbing', 'adventure parks', 'outdoor sports', 'zip lining', 'kayaking'],
    places: ['national parks', 'adventure centers', 'climbing gyms', 'hiking trails', 'water sports venues']
  },
  {
    id: 'cultural',
    name: 'Culture Enthusiast',
    description: 'Enjoys museums, art galleries, and cultural events',
    ageGroups: ['25-35', '36-50'],
    keywords: ['museums', 'art galleries', 'theaters', 'cultural centers', 'exhibitions', 'concerts'],
    places: ['art museums', 'history museums', 'galleries', 'concert halls', 'cultural districts']
  },
  {
    id: 'foodie',
    name: 'Food Explorer',
    description: 'Passionate about trying new cuisines and restaurants',
    ageGroups: ['18-25', '26-35', '36-50'],
    keywords: ['restaurants', 'food markets', 'cooking classes', 'wine tastings', 'street food', 'cafes'],
    places: ['fine dining restaurants', 'food halls', 'farmers markets', 'cooking schools', 'wine bars']
  },
  {
    id: 'nightlife',
    name: 'Night Owl',
    description: 'Enjoys bars, clubs, and evening entertainment',
    ageGroups: ['18-25', '26-35'],
    keywords: ['bars', 'nightclubs', 'live music venues', 'rooftop lounges', 'cocktail bars', 'dance clubs'],
    places: ['nightclubs', 'cocktail lounges', 'live music venues', 'rooftop bars', 'entertainment districts']
  },
  {
    id: 'wellness',
    name: 'Wellness Focused',
    description: 'Prefers relaxing and health-focused activities',
    ageGroups: ['26-35', '36-50'],
    keywords: ['spas', 'yoga studios', 'meditation centers', 'wellness retreats', 'massage', 'mindfulness'],
    places: ['day spas', 'yoga studios', 'wellness centers', 'meditation gardens', 'health retreats']
  },
  {
    id: 'shopping',
    name: 'Retail Therapy',
    description: 'Loves shopping and browsing markets',
    ageGroups: ['18-25', '26-35'],
    keywords: ['shopping malls', 'boutiques', 'markets', 'vintage stores', 'designer shops', 'local crafts'],
    places: ['shopping centers', 'boutique districts', 'vintage markets', 'artisan shops', 'fashion districts']
  },
  {
    id: 'nature',
    name: 'Nature Lover',
    description: 'Enjoys peaceful outdoor settings and natural beauty',
    ageGroups: ['18-25', '26-35', '36-50'],
    keywords: ['parks', 'gardens', 'beaches', 'lakes', 'scenic walks', 'wildlife'],
    places: ['botanical gardens', 'nature reserves', 'beaches', 'lakeshores', 'scenic viewpoints']
  },
  {
    id: 'entertainment',
    name: 'Entertainment Enthusiast',
    description: 'Loves movies, games, and interactive experiences',
    ageGroups: ['18-25', '26-35'],
    keywords: ['movies', 'gaming', 'arcades', 'bowling', 'mini golf', 'escape rooms'],
    places: ['movie theaters', 'gaming centers', 'bowling alleys', 'escape rooms', 'entertainment complexes']
  }
];

export const PERSONALITY_TYPES: PersonalityType[] = [
  {
    id: 'adventurous_extrovert',
    name: 'Social Adventurer',
    description: 'Loves trying new things with friends and meeting new people',
    traits: ['outgoing', 'spontaneous', 'energetic', 'social'],
    preferredActivities: ['group activities', 'adventure sports', 'nightlife', 'festivals'],
    socialStyle: 'extrovert',
    adventureLevel: 'high',
    budgetPreference: 'moderate'
  },
  {
    id: 'cultural_introvert',
    name: 'Thoughtful Explorer',
    description: 'Prefers meaningful experiences and quiet contemplation',
    traits: ['reflective', 'curious', 'artistic', 'thoughtful'],
    preferredActivities: ['museums', 'galleries', 'quiet cafes', 'bookstores'],
    socialStyle: 'introvert',
    adventureLevel: 'low',
    budgetPreference: 'moderate'
  },
  {
    id: 'wellness_ambivert',
    name: 'Balanced Seeker',
    description: 'Values both social connection and personal well-being',
    traits: ['balanced', 'health-conscious', 'mindful', 'adaptable'],
    preferredActivities: ['yoga', 'wellness retreats', 'nature walks', 'healthy dining'],
    socialStyle: 'ambivert',
    adventureLevel: 'medium',
    budgetPreference: 'moderate'
  },
  {
    id: 'foodie_social',
    name: 'Culinary Socialite',
    description: 'Bonds with others through shared dining experiences',
    traits: ['social', 'curious', 'appreciative', 'generous'],
    preferredActivities: ['fine dining', 'food tours', 'cooking classes', 'wine tastings'],
    socialStyle: 'extrovert',
    adventureLevel: 'medium',
    budgetPreference: 'premium'
  },
  {
    id: 'entertainment_lover',
    name: 'Fun Seeker',
    description: 'Enjoys entertainment and playful activities',
    traits: ['playful', 'competitive', 'fun-loving', 'energetic'],
    preferredActivities: ['games', 'movies', 'bowling', 'arcades'],
    socialStyle: 'extrovert',
    adventureLevel: 'medium',
    budgetPreference: 'budget'
  },
  {
    id: 'nature_peaceful',
    name: 'Peaceful Wanderer',
    description: 'Finds joy in natural settings and quiet moments',
    traits: ['peaceful', 'contemplative', 'nature-loving', 'calm'],
    preferredActivities: ['hiking', 'gardens', 'beaches', 'scenic drives'],
    socialStyle: 'introvert',
    adventureLevel: 'low',
    budgetPreference: 'budget'
  }
];

export const getVibesByAge = (age: number): VibeType[] => {
  let ageGroup = '';
  if (age >= 18 && age <= 25) ageGroup = '18-25';
  else if (age >= 26 && age <= 35) ageGroup = '26-35';
  else if (age >= 36 && age <= 50) ageGroup = '36-50';
  else ageGroup = '18-25'; // default

  return VIBE_TYPES.filter(vibe => vibe.ageGroups.includes(ageGroup));
};

export const assessPersonality = (swipeResults: { vibeType: string; direction: 'left' | 'right' }[]): PersonalityType => {
  const likedVibes = swipeResults.filter(s => s.direction === 'right').map(s => s.vibeType);
  const totalSwipes = swipeResults.length;
  const likedCount = likedVibes.length;
  
  // Calculate personality based on preferences
  const adventureCount = likedVibes.filter(v => ['Adventure Seeker', 'Nature Lover'].includes(v)).length;
  const socialCount = likedVibes.filter(v => ['Night Owl', 'Food Explorer', 'Entertainment Enthusiast'].includes(v)).length;
  const cultureCount = likedVibes.filter(v => ['Culture Enthusiast', 'Wellness Focused'].includes(v)).length;
  const shoppingCount = likedVibes.filter(v => ['Retail Therapy'].includes(v)).length;
  
  // Determine personality type based on preferences
  if (adventureCount >= 2 && socialCount >= 1) {
    return PERSONALITY_TYPES.find(p => p.id === 'adventurous_extrovert') || PERSONALITY_TYPES[0];
  } else if (cultureCount >= 2 && likedCount <= totalSwipes * 0.4) {
    return PERSONALITY_TYPES.find(p => p.id === 'cultural_introvert') || PERSONALITY_TYPES[1];
  } else if (likedVibes.includes('Wellness Focused') && likedCount >= totalSwipes * 0.4) {
    return PERSONALITY_TYPES.find(p => p.id === 'wellness_ambivert') || PERSONALITY_TYPES[2];
  } else if (likedVibes.includes('Food Explorer') && socialCount >= 1) {
    return PERSONALITY_TYPES.find(p => p.id === 'foodie_social') || PERSONALITY_TYPES[3];
  } else if (likedVibes.includes('Entertainment Enthusiast') || shoppingCount >= 1) {
    return PERSONALITY_TYPES.find(p => p.id === 'entertainment_lover') || PERSONALITY_TYPES[4];
  } else {
    return PERSONALITY_TYPES.find(p => p.id === 'nature_peaceful') || PERSONALITY_TYPES[5];
  }
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Bangalore',
  'Mumbai',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Surat',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivli',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Chandigarh',
  'Guwahati',
  'Solapur',
  'Hubli-Dharwad',
  'Tiruchirappalli',
  'Bareilly',
  'Mysore',
  'Tiruppur',
  'Gurgaon',
  'Aligarh',
  'Jalandhar',
  'Bhubaneswar',
  'Salem',
  'Warangal',
  'Guntur',
  'Bhiwandi',
  'Saharanpur',
  'Gorakhpur',
  'Bikaner',
  'Amravati',
  'Noida',
  'Jamshedpur',
  'Bhilai',
  'Cuttack',
  'Firozabad',
  'Kochi',
  'Nellore',
  'Bhavnagar',
  'Dehradun',
  'Durgapur',
  'Asansol',
  'Rourkela',
  'Nanded',
  'Kolhapur',
  'Ajmer',
  'Akola',
  'Gulbarga',
  'Jamnagar',
  'Ujjain',
  'Loni',
  'Siliguri',
  'Jhansi',
  'Ulhasnagar',
  'Jammu',
  'Sangli-Miraj & Kupwad',
  'Mangalore',
  'Erode',
  'Belgaum',
  'Ambattur',
  'Tirunelveli',
  'Malegaon',
  'Gaya',
  'Jalgaon',
  'Udaipur',
  'Maheshtala'
];

export const generateCompatibleItinerary = async (
  user1Personality: PersonalityType,
  user2Personality: PersonalityType,
  location: string,
  user1Preferences: string[],
  user2Preferences: string[]
): Promise<string> => {
  const commonPreferences = user1Preferences.filter(p => user2Preferences.includes(p));
  const allPreferences = [...new Set([...user1Preferences, ...user2Preferences])];
  
  const budgetLevel = user1Personality.budgetPreference === 'premium' || user2Personality.budgetPreference === 'premium' 
    ? 'moderate to premium' 
    : user1Personality.budgetPreference === 'budget' && user2Personality.budgetPreference === 'budget'
    ? 'budget-friendly'
    : 'moderate';
    
  const socialStyle = user1Personality.socialStyle === 'extrovert' || user2Personality.socialStyle === 'extrovert'
    ? 'social and engaging'
    : 'intimate and relaxed';
    
  const adventureLevel = Math.max(
    user1Personality.adventureLevel === 'high' ? 3 : user1Personality.adventureLevel === 'medium' ? 2 : 1,
    user2Personality.adventureLevel === 'high' ? 3 : user2Personality.adventureLevel === 'medium' ? 2 : 1
  );
  
  const adventureDescription = adventureLevel >= 3 ? 'adventurous and exciting' 
    : adventureLevel >= 2 ? 'moderately adventurous' 
    : 'relaxed and comfortable';

  const prompt = `Create a detailed day outing itinerary for two friends in ${location}. 

Personality Types:
- Person 1: ${user1Personality.name} - ${user1Personality.description}
- Person 2: ${user2Personality.name} - ${user2Personality.description}

Shared Interests: ${commonPreferences.join(', ') || 'None specifically shared'}
All Interests: ${allPreferences.join(', ')}

Preferences:
- Budget: ${budgetLevel}
- Social Style: ${socialStyle}
- Adventure Level: ${adventureDescription}

Please create a 6-8 hour itinerary that:
1. Balances both personalities
2. Includes 3-4 main activities
3. Suggests specific venues/locations in ${location}
4. Includes meal recommendations
5. Provides timing and logistics
6. Considers travel time between locations

Format as a detailed schedule with times, locations, and brief descriptions.`;

  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an expert outing planner who creates detailed, personalized itineraries that perfectly balance different personality types and preferences.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.completion;
    }
    throw new Error('Failed to generate itinerary');
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
};