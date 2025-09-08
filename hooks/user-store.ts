import { getVibesByAge } from '@/constants/vibes';
import { GeneratedImage, InviteLink, SwipeSession, User } from '@/types/user';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

const DEMO_FRIENDS: User[] = [
  {
    id: 'demo_friend_1',
    name: 'Priya Sharma',
    age: 24,
    location: 'Mumbai',
    gender: 'Female',
    interests: ['Food & Dining', 'Shopping', 'Art & Culture', 'Music'],
    profileComplete: true
  },
  {
    id: 'demo_friend_2',
    name: 'Arjun Patel',
    age: 28,
    location: 'Bangalore',
    gender: 'Male',
    interests: ['Adventure Sports', 'Nature', 'Technology', 'Fitness'],
    profileComplete: true
  },
  {
    id: 'demo_friend_3',
    name: 'Sneha Reddy',
    age: 26,
    location: 'Hyderabad',
    gender: 'Female',
    interests: ['Wellness', 'Nature', 'Food & Dining', 'Art & Culture'],
    profileComplete: true
  },
  {
    id: 'demo_friend_4',
    name: 'Rohit Kumar',
    age: 30,
    location: 'Delhi',
    gender: 'Male',
    interests: ['Nightlife', 'Entertainment', 'Food & Dining', 'Music'],
    profileComplete: true
  },
  {
    id: 'demo_friend_5',
    name: 'Kavya Nair',
    age: 22,
    location: 'Kochi',
    gender: 'Female',
    interests: ['Art & Culture', 'Music', 'Shopping', 'Wellness'],
    profileComplete: true
  }
];

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<SwipeSession | null>(null);
  const [sessions, setSessions] = useState<SwipeSession[]>([]);
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([]);
  const [demoFriends] = useState<User[]>(DEMO_FRIENDS);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      
      const storedSessions = await AsyncStorage.getItem('sessions');
      if (storedSessions) {
        try {
          const parsedSessions = JSON.parse(storedSessions);
          // Clean up old sessions on load
          const recentSessions = parsedSessions.slice(-10);
          setSessions(recentSessions);
        } catch (parseError) {
          console.error('Failed to parse sessions, clearing:', parseError);
          await AsyncStorage.removeItem('sessions');
          setSessions([]);
        }
      }
      
      const storedInvites = await AsyncStorage.getItem('inviteLinks');
      if (storedInvites) {
        try {
          setInviteLinks(JSON.parse(storedInvites));
        } catch (parseError) {
          console.error('Failed to parse invites, clearing:', parseError);
          await AsyncStorage.removeItem('inviteLinks');
          setInviteLinks([]);
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // Clear corrupted data
      if (error && (error as any).message?.includes('SQLITE_FULL')) {
        console.log('Storage full, clearing old data...');
        await AsyncStorage.multiRemove(['sessions', 'inviteLinks']);
        setSessions([]);
        setInviteLinks([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }, []);

  const saveSessions = useCallback(async (sessionsData: SwipeSession[]) => {
    try {
      // Limit to last 10 sessions to prevent storage overflow
      const limitedSessions = sessionsData.slice(-10);
      
      // Compress images in sessions to save space
      const compressedSessions = limitedSessions.map(session => ({
        ...session,
        images: session.images.map(img => ({
          ...img,
          // Only store essential data, remove base64 if it's too large
          url: img.url.startsWith('data:') && img.url.length > 50000 
            ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' // Fallback URL
            : img.url
        }))
      }));
      
      await AsyncStorage.setItem('sessions', JSON.stringify(compressedSessions));
      setSessions(compressedSessions);
    } catch (error) {
      console.error('Failed to save sessions:', error);
      // If still failing, clear old data and retry
      if (error && (error as any).message?.includes('SQLITE_FULL')) {
        try {
          await AsyncStorage.removeItem('sessions');
          const minimalSessions = sessionsData.slice(-3); // Keep only last 3
          await AsyncStorage.setItem('sessions', JSON.stringify(minimalSessions));
          setSessions(minimalSessions);
        } catch (retryError) {
          console.error('Failed to save even minimal sessions:', retryError);
        }
      }
    }
  }, []);

  const saveInviteLinks = useCallback(async (invitesData: InviteLink[]) => {
    try {
      await AsyncStorage.setItem('inviteLinks', JSON.stringify(invitesData));
      setInviteLinks(invitesData);
    } catch (error) {
      console.error('Failed to save invite links:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await saveUser(updatedUser);
  }, [user, saveUser]);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'profileComplete'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      profileComplete: true
    };
    await saveUser(newUser);
    return newUser;
  }, [saveUser]);

  const generateUserImages = useCallback(async (targetUser: User): Promise<GeneratedImage[]> => {
    const userVibes = getVibesByAge(targetUser.age);
    const generatedImages: GeneratedImage[] = [];
    
    console.log(`Generating images for ${targetUser.name} based on vibes:`, userVibes.map(v => v.name));
    
    // Fallback images from Unsplash for different vibe types
    const fallbackImages: Record<string, string> = {
      'Adventure Seeker': 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=800&q=80',
      'Culture Enthusiast': 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
      'Foodie': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'Night Owl': 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
      'Shopaholic': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      'Wellness Guru': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
      'Music Lover': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'Nature Lover': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'Tech Enthusiast': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      'Fitness Fanatic': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'Entertainment Buff': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      'Social Butterfly': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      'Creative Soul': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
      'Trendsetter': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      'Chill Seeker': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    };
    
    // Limit to 6 images to reduce storage usage
    for (const vibe of userVibes.slice(0, 6)) {
      let imageUrl: string | null = null;
      
      // Skip AI generation for now to avoid storage issues, use fallback images
      imageUrl = fallbackImages[vibe.name] || fallbackImages['Chill Seeker'];
      
      // Always add an image (either generated or fallback)
      if (imageUrl) {
        generatedImages.push({
          id: `${targetUser.id}-${vibe.id}-${Date.now()}-${Math.random()}`,
          url: imageUrl,
          vibeType: vibe.name,
          description: vibe.description,
          userId: targetUser.id,
          keywords: vibe.keywords,
        });
      }
    }
    
    console.log(`Generated/loaded ${generatedImages.length} images for ${targetUser.name}`);
    return generatedImages;
  }, []);

  const createInviteLink = useCallback(async (friendName: string): Promise<InviteLink> => {
    if (!user) throw new Error('User not found');
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inviteLink: InviteLink = {
      id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      inviterId: user.id,
      inviterName: user.name,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      used: false
    };
    
    const updatedInvites = [...inviteLinks, inviteLink];
    await saveInviteLinks(updatedInvites);
    
    return inviteLink;
  }, [user, inviteLinks, saveInviteLinks]);

  const createSwipeSession = useCallback(async (friendUser: User, inviteId?: string): Promise<SwipeSession> => {
    if (!user) throw new Error('User not found');
    
    console.log('Creating swipe session between:', user.name, 'and', friendUser.name);
    
    // Generate images for both users
    const [userImages, friendImages] = await Promise.all([
      generateUserImages(user),
      generateUserImages(friendUser)
    ]);
    
    console.log('Generated images:', { userImages: userImages.length, friendImages: friendImages.length });
    
    // Remove duplicates and keep ~2 per vibe type
    const combinedImages = [...userImages, ...friendImages];
    const uniqueImages = combinedImages.reduce((acc: GeneratedImage[], current) => {
      const vibeCount = acc.filter(img => img.vibeType === current.vibeType).length;
      if (vibeCount < 2) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    console.log('Unique images after deduplication:', uniqueImages.length);
    
    const session: SwipeSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      users: [user.id, friendUser.id],
      userNames: [user.name, friendUser.name],
      images: uniqueImages,
      swipes: {},
      status: 'active',
      createdAt: Date.now()
    };
    
    const updatedSessions = [...sessions, session];
    await saveSessions(updatedSessions);
    setCurrentSession(session);
    
    // Mark invite as used if provided
    if (inviteId) {
      const updatedInvites = inviteLinks.map(invite => 
        invite.id === inviteId ? { ...invite, used: true } : invite
      );
      await saveInviteLinks(updatedInvites);
    }
    
    console.log('Created session:', session.id);
    return session;
  }, [user, sessions, inviteLinks, saveSessions, saveInviteLinks, generateUserImages]);

  const updateSession = useCallback(async (sessionId: string, updates: Partial<SwipeSession>) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    );
    await saveSessions(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession({ ...currentSession, ...updates });
    }
  }, [sessions, currentSession, saveSessions]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('sessions');
      await AsyncStorage.removeItem('inviteLinks');
      setUser(null);
      setCurrentSession(null);
      setSessions([]);
      setInviteLinks([]);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    currentSession,
    sessions,
    inviteLinks,
    demoFriends,
    setCurrentSession,
    loading,
    saveUser,
    updateUser,
    createUser,
    generateUserImages,
    createInviteLink,
    createSwipeSession,
    updateSession,
    logout
  }), [user, currentSession, sessions, inviteLinks, demoFriends, loading, saveUser, updateUser, createUser, generateUserImages, createInviteLink, createSwipeSession, updateSession, logout]);

  return value;
});