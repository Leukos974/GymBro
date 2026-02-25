import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function TopBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/profile')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name="account-circle-outline" size={28} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.accent }]}>GymBro</Text>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/settings')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name="cog-outline" size={28} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  iconBtn: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
