// ==============================================================================
// Lankora: App Entry Redirect
// ==============================================================================

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
