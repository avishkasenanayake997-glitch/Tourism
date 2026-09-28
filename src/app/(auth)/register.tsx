// ==============================================================================
// Lankora: Register Screen
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Required Fields', 'Please complete all fields.');
      return;
    }

    setLoading(true);
    const res = await signUp(name.trim(), email.trim(), password);
    setLoading(false);

    if (res.error) {
      Alert.alert('Registration Failed', res.error);
    } else {
      Alert.alert('Welcome to Lankora', 'Your explorer profile has been created.', [
        { text: 'Start Discovering', onPress: () => router.replace('/(tabs)/home' as any) },
      ]);
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80' }}
        style={(StyleSheet.absoluteFill as any)}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 30) }]}
      >
        <View style={styles.brandBox}>
          <Typography variant="badge" color={Colors.sand.warm} weight="700">
            JOIN LANKORA
          </Typography>
          <Typography variant="display" color="#FFFFFF" weight="800" style={styles.brandTitle}>
            Create Explorer Account
          </Typography>
          <Typography variant="body" color={Colors.sand.soft}>
            Curate trips, bookmark hidden gems, and share authentic Sri Lankan reviews.
          </Typography>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Typography variant="caption" color={Colors.dark.textMuted} weight="700">
              FULL NAME
            </Typography>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={Colors.emerald.mint} style={styles.inputIcon} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Avishka Sahan"
                placeholderTextColor={Colors.dark.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Typography variant="caption" color={Colors.dark.textMuted} weight="700">
              EMAIL ADDRESS
            </Typography>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.emerald.mint} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="traveler@ceylon.com"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Typography variant="caption" color={Colors.dark.textMuted} weight="700">
              PASSWORD
            </Typography>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.emerald.mint} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a secure password"
                placeholderTextColor={Colors.dark.textMuted}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleSignUp}
            variant="sunset"
            size="lg"
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.footerRow}>
            <Typography variant="bodySmall" color={Colors.dark.textMuted}>
              Already an explorer?
            </Typography>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Typography variant="bodySmall" color={Colors.emerald.accent} weight="700" style={{ marginLeft: 6 }}>
                Sign In
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  overlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(11, 17, 15, 0.72)',
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 60,
  },
  brandBox: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  brandTitle: {
    marginTop: 4,
    marginBottom: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  field: {
    marginBottom: Spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 12,
    marginTop: 6,
    height: 48,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
});
