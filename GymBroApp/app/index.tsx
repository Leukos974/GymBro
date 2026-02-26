import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButtons } from '@/components/action-buttons';
import { MatchModal } from '@/components/match-modal';
import { ProfileCard } from '@/components/profile-card';
import { TopBar } from '@/components/top-bar';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { User } from '@/types';

// ── Mock data ───────────────────────────────────────────────
// Replace `imageUri` values with your own local or remote image URLs
// to make the cards look polished.
const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Alex',
    family_name: 'Dupont',
    age: 24,
    type: 'mass_gain',
    description: 'Looking for a gym buddy to push through heavy sets! 💪',
    gym_id: 1,
    attachment_id: null,
    gym_name: 'FitPark Central',
    gym_location: 'Paris 1er',
    exos: ['Bench', 'Squat', 'Deadlift'],
    imageUri: null, // ← put your image URI here
  },
  {
    id: 2,
    name: 'Marie',
    family_name: 'Leroy',
    age: 22,
    type: 'cardio',
    description: 'Running lover, training for a marathon 🏃‍♀️',
    gym_id: 1,
    attachment_id: null,
    gym_name: 'FitPark Central',
    gym_location: 'Paris 1er',
    exos: ['Running', 'Cycling', 'HIIT'],
    imageUri: null,
  },
  {
    id: 3,
    name: 'Thomas',
    family_name: 'Bernard',
    age: 28,
    type: 'strength',
    description: "Powerlifter, always down for PR attempts. Let's hit some heavy triples!",
    gym_id: 2,
    attachment_id: null,
    gym_name: 'IronHouse',
    gym_location: 'Lyon 3e',
    exos: ['Squat', 'Deadlift', 'OHP'],
    imageUri: null,
  },
  {
    id: 4,
    name: 'Camille',
    family_name: 'Moreau',
    age: 25,
    type: 'mass_loss',
    description: 'On a cut right now, need an accountability partner to keep me on track.',
    gym_id: 1,
    attachment_id: null,
    gym_name: 'FitPark Central',
    gym_location: 'Paris 1er',
    exos: ['Push', 'Pull', 'Legs'],
    imageUri: null,
  },
  {
    id: 5,
    name: 'Lucas',
    family_name: 'Petit',
    age: 30,
    type: 'flexibility',
    description: "Yoga + calisthenics. Let's stretch and grow! 🧘",
    gym_id: 3,
    attachment_id: null,
    gym_name: 'Muscle Factory',
    gym_location: 'Marseille 6e',
    exos: ['Yoga', 'Handstand', 'Rings'],
    imageUri: null,
  },
];

const SWIPE_THRESHOLD = 120;

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();

  const [users] = useState<User[]>(MOCK_USERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchModal, setMatchModal] = useState<{ visible: boolean; name: string }>({
    visible: false,
    name: '',
  });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];

  // ── Advance to next card ────────────────────────────────
  const goNext = useCallback(
    (liked: boolean) => {
      if (liked && currentUser) {
        // Simulate a random match ~30 % of the time
        if (Math.random() < 0.3) {
          setMatchModal({ visible: true, name: currentUser.name });
        }
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentUser],
  );

  // ── Gesture handler ─────────────────────────────────────
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.4;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(width + 100, { duration: 300 }, () => {
          runOnJS(goNext)(true);
          translateX.value = 0;
          translateY.value = 0;
        });
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width - 100, { duration: 300 }, () => {
          runOnJS(goNext)(false);
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        translateX.value = withSpring(0, { damping: 20 });
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-width, 0, width],
          [-15, 0, 15],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const passOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  // ── Button handlers ─────────────────────────────────────
  const handlePass = () => {
    translateX.value = withTiming(-width - 100, { duration: 350 }, () => {
      runOnJS(goNext)(false);
      translateX.value = 0;
      translateY.value = 0;
    });
  };

  const handleLike = () => {
    translateX.value = withTiming(width + 100, { duration: 350 }, () => {
      runOnJS(goNext)(true);
      translateX.value = 0;
      translateY.value = 0;
    });
  };

  const noMoreUsers = currentIndex >= users.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar />

      <View style={styles.cardContainer}>
        {noMoreUsers ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏋️</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No more profiles!</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Check back later or adjust your filters in Settings.
            </Text>
          </View>
        ) : (
          <>
            {/* Next card (behind) */}
            {nextUser && (
              <View style={[styles.cardWrapper, { zIndex: 0 }]}>
                <ProfileCard user={nextUser} />
              </View>
            )}

            {/* Current card (swipeable) */}
            {currentUser && (
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.cardWrapper, { zIndex: 1 }, animatedCardStyle]}>
                  {/* LIKE overlay */}
                  <Animated.View
                    style={[styles.overlayBadge, styles.likeBadge, likeOverlayStyle]}
                    pointerEvents="none"
                  >
                    <Text style={[styles.overlayText, { color: colors.success }]}>LIKE</Text>
                  </Animated.View>

                  {/* NOPE overlay */}
                  <Animated.View
                    style={[styles.overlayBadge, styles.nopeBadge, passOverlayStyle]}
                    pointerEvents="none"
                  >
                    <Text style={[styles.overlayText, { color: colors.accent }]}>NOPE</Text>
                  </Animated.View>

                  <ProfileCard user={currentUser} />
                </Animated.View>
              </GestureDetector>
            )}
          </>
        )}
      </View>

      {!noMoreUsers && <ActionButtons onPass={handlePass} onLike={handleLike} />}

      <MatchModal
        visible={matchModal.visible}
        matchedName={matchModal.name}
        onClose={() => setMatchModal({ visible: false, name: '' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: { position: 'absolute' },
  overlayBadge: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    borderWidth: 4,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  likeBadge: {
    left: 24,
    borderColor: '#27AE60',
    transform: [{ rotate: '-20deg' }],
  },
  nopeBadge: {
    right: 24,
    borderColor: '#E74C3C',
    transform: [{ rotate: '20deg' }],
  },
  overlayText: { fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  emptyState: { alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
