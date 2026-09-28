// ==============================================================================
// Lankora: Login Screen
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const res = await signIn(email.trim(), password);
    setLoading(false);

    if (res.error) {
      Alert.alert('Sign In Failed', res.error);
    } else {
      router.replace('/(tabs)/home' as any);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('explorer@lankora.com');
    setPassword('ceylon123');
    setLoading(true);
    await signIn('explorer@lankora.com', 'ceylon123');
    setLoading(false);
    router.replace('/(tabs)/home' as any);
  };

  return (
    <View style={styles.screen}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80' }}
        style={(StyleSheet.absoluteFill as any)}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 30) }]}
      >
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <Typography variant="badge" color={Colors.sand.warm} weight="700">
            WELCOME TO LANKORA
          </Typography>
          <Typography variant="display" color="#FFFFFF" weight="800" style={styles.brandTitle}>
            Begin Your Island Odyssey
          </Typography>
          <Typography variant="body" color={Colors.sand.soft} style={styles.brandDesc}>
            Access your saved itineraries, personalized recommendations, and reviews.
          </Typography>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
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
                placeholder="Enter password"
                placeholderTextColor={Colors.dark.textMuted}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.dark.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password' as any)}
            style={styles.forgotBtn}
          >
            <Typography variant="caption" color={Colors.sand.warm} weight="600">
              Forgot your password?
            </Typography>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            variant="sunset"
            size="lg"
            loading={loading}
            style={styles.submitBtn}
          />

          <Button
            title="One-Tap Explorer Demo Sign In"
            onPress={handleDemoSignIn}
            variant="secondary"
            size="md"
            style={{ marginTop: Spacing.sm }}
          />

          <View style={styles.footerRow}>
            <Typography variant="bodySmall" color={Colors.dark.textMuted}>
              New to Lankora?
            </Typography>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
              <Typography variant="bodySmall" color={Colors.emerald.accent} weight="700" style={{ marginLeft: 6 }}>
                Create Account
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
  brandDesc: {
    lineHeight: 22,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
});
