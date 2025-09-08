export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: string;
  interests: string[];
  vibeType?: string;
  personalityType?: PersonalityType;
  profileComplete: boolean;
  generatedImages?: GeneratedImage[];
}

export interface SwipeSession {
  id: string;
  users: [string, string];
  userNames: [string, string];
  images: GeneratedImage[];
  swipes: Record<string, SwipeResult[]>;
  status: 'waiting' | 'active' | 'completed';
  itinerary?: string;
  personalityAssessments?: Record<string, PersonalityType>;
  createdAt: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  vibeType: string;
  description: string;
  userId: string;
  keywords: string[];
}

export interface SwipeResult {
  imageId: string;
  direction: 'left' | 'right';
  timestamp: number;
  vibeType: string;
}

export interface VibeType {
  id: string;
  name: string;
  description: string;
  ageGroups: string[];
  keywords: string[];
  places: string[];
}

export interface PersonalityType {
  id: string;
  name: string;
  description: string;
  traits: string[];
  preferredActivities: string[];
  socialStyle: 'introvert' | 'extrovert' | 'ambivert';
  adventureLevel: 'low' | 'medium' | 'high';
  budgetPreference: 'budget' | 'moderate' | 'premium';
}

export interface InviteLink {
  id: string;
  sessionId: string;
  inviterId: string;
  inviterName: string;
  expiresAt: number;
  used: boolean;
}