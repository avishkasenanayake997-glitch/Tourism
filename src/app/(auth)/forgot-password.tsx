// ==============================================================================
// Lankora: Forgot Password Screen
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    Alert.alert(
      'Recovery Email Dispatched',
      `We’ve sent password recovery instructions to ${email}.`,
      [{ text: 'Return to Sign In', onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header title="Password Recovery" showBack />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={32} color={Colors.emerald.mint} />
        </View>

        <Typography variant="h2" weight="700" align="center" style={styles.title}>
          Reset Your Password
        </Typography>

        <Typography variant="body" color={Colors.dark.textMuted} align="center" style={styles.desc}>
          Enter the email associated with your Lankora explorer account, and we’ll send you a recovery link.
        </Typography>

        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color={Colors.emerald.mint} style={{ marginRight: Spacing.sm }} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="explorer@ceylon.com"
            placeholderTextColor={Colors.dark.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <Button
          title="Send Recovery Email"
          onPress={handleReset}
          variant="sunset"
          size="lg"
          loading={loading}
          style={{ width: '100%', marginTop: Spacing.lg }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(78, 171, 139, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(78, 171, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  desc: {
    lineHeight: 22,
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 12,
    width: '100%',
    height: 48,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
  },
});
