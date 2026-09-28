// ==============================================================================
// Lankora: SSR-Safe AsyncStorage Wrapper
// Prevents "ReferenceError: window is not defined" during Node/Web SSR bundling
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isServer = typeof window === 'undefined';

export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isServer) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isServer) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },

  async removeItem(key: string): Promise<void> {
    if (isServer) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  }
};

export default safeStorage;
