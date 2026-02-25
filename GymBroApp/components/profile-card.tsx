import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EXERCISE_TYPE_META, User } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const typeMeta = EXERCISE_TYPE_META[user.type];
  const imageUrl = user.imageUri ?? null;

  const CARD_WIDTH = width - 32;
  const CARD_HEIGHT = CARD_WIDTH * 1.45;

  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: colors.card }]}>
      {/* ── Header bar ─────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        {user.gym_name ? (
          <View style={styles.gymBadge}>
            <MaterialCommunityIcons name="map-marker" size={14} color={colors.accent} />
            <Text style={[styles.gymName, { color: colors.text }]} numberOfLines={1}>
              {user.gym_name}
            </Text>
            {user.gym_location ? (
              <Text style={[styles.gymLocation, { color: colors.textSecondary }]} numberOfLines={1}>
                {user.gym_location}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* ── Photo area ─────────────────────────────────────── */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.border }]}>
            <MaterialCommunityIcons name="account" size={100} color={colors.textSecondary} />
          </View>
        )}
        {/* Gradient overlay at bottom of image */}
        <LinearGradient
          colors={['transparent', colorScheme === 'dark' ? '#161B22' : '#FFFFFF']}
          style={styles.gradient}
        />
      </View>

      {/* ── Info section ───────────────────────────────────── */}
      <View style={styles.infoSection}>
        {/* Name, age, type badge */}
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user.name}, {user.age}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: typeMeta.color + '22' }]}>
            <MaterialCommunityIcons
              name={typeMeta.icon as any}
              size={18}
              color={typeMeta.color}
            />
          </View>
        </View>

        {/* Description */}
        {user.description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
            {user.description}
          </Text>
        ) : null}

        {/* Exos bubbles */}
        {user.exos && user.exos.length > 0 ? (
          <View style={styles.exosRow}>
            {user.exos.slice(0, 3).map((exo, i) => (
              <View key={i} style={[styles.exoBubble, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.exoText, { color: colors.accent }]}>{exo}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gymBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  gymName: {
    fontSize: 13,
    fontWeight: '700',
  },
  gymLocation: {
    fontSize: 11,
  },
  imageContainer: {
    flex: 1,
    minHeight: '55%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
  },
  typeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  exosRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  exoBubble: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  exoText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
