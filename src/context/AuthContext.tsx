// ==============================================================================
// Lankora: Authentication Context
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, pass: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const DEMO_USER: Profile = {
  id: 'current-user',
  name: 'Avishka Sahan',
  email: 'explorer@lankora.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Chasing Ceylon sunrises, wild tea hills, and southern point breaks.',
  travel_preferences: {
    travel_style: ['Culture', 'Nature', 'Photography'],
    pace: 'Moderate',
    dietary: ['Vegetarian Friendly', 'Authentic Spice']
  },
  home_country: 'Sri Lanka'
};

const USER_SESSION_KEY = '@lankora_auth_user';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(DEMO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (profile) {
            setUser(profile as Profile);
          } else {
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || 'Explorer',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar,
              bio: 'Exploring Sri Lanka with Lankora',
              travel_preferences: { travel_style: ['Nature'], pace: 'Moderate', dietary: [] }
            });
          }
        } else {
          // Check local cached guest/demo session
          const cached = await AsyncStorage.getItem(USER_SESSION_KEY);
          if (cached) {
            setUser(JSON.parse(cached));
          } else {
            setUser(DEMO_USER);
          }
        }
      } else {
        const cached = await AsyncStorage.getItem(USER_SESSION_KEY);
        if (cached) {
          setUser(JSON.parse(cached));
        } else {
          setUser(DEMO_USER);
        }
      }
    } catch (e) {
      console.warn('Auth init fallback:', e);
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, pass: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) return { error: error.message };
        if (data.user) {
          const profile: Profile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            travel_preferences: { travel_style: ['Culture'], pace: 'Moderate', dietary: [] }
          };
          setUser(profile);
          await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
          return {};
        }
      }
      // Demo sign in
      const profile: Profile = {
        ...DEMO_USER,
        email,
        name: email.split('@')[0],
      };
      setUser(profile);
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
      return {};
    } catch (e: any) {
      return { error: e.message || 'Login failed' };
    }
  };

  const signUp = async (name: string, email: string, pass: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { name } }
        });
        if (error) return { error: error.message };
        if (data.user) {
          const profile: Profile = {
            id: data.user.id,
            name,
            email,
            travel_preferences: { travel_style: ['Culture', 'Nature'], pace: 'Moderate', dietary: [] }
          };
          setUser(profile);
          await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
          return {};
        }
      }
      const profile: Profile = {
        ...DEMO_USER,
        name,
        email,
      };
      setUser(profile);
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
      return {};
    } catch (e: any) {
      return { error: e.message || 'Signup failed' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    await AsyncStorage.removeItem(USER_SESSION_KEY);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
