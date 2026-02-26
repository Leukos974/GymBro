import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EXERCISE_TYPE_META, Match } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_MATCHES: Match[] = [
  {
    relation_id: 1,
    partner_id: 2,
    name: 'Marie',
    family_name: 'Leroy',
    age: 22,
    type: 'cardio',
    attachment_id: null,
    gym_name: 'FitPark Central',
  },
  {
    relation_id: 2,
    partner_id: 3,
    name: 'Thomas',
    family_name: 'Bernard',
    age: 28,
    type: 'strength',
    attachment_id: null,
    gym_name: 'IronHouse',
  },
];

export default function MatchesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [matches] = useState<Match[]>(MOCK_MATCHES);

  const renderMatch = ({ item }: { item: Match }) => {
    const meta = EXERCISE_TYPE_META[item.type];
    return (
      <TouchableOpacity
        style={[styles.matchCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() =>
          router.push({
            pathname: '/chat',
            params: { relationId: item.relation_id, partnerName: item.name },
          })
        }
        activeOpacity={0.7}
      >
        <View style={[styles.matchAvatar, { backgroundColor: meta.color + '22' }]}>
          <MaterialCommunityIcons name={meta.icon as any} size={28} color={meta.color} />
        </View>
        <View style={styles.matchInfo}>
          <Text style={[styles.matchName, { color: colors.text }]}>
            {item.name} {item.family_name}
          </Text>
          <Text style={[styles.matchMeta, { color: colors.textSecondary }]}>
            {item.age} • {item.gym_name} • {meta.label}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Matches</Text>
        <View style={{ width: 26 }} />
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48 }}>🤝</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No matches yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Keep swiping to find gym partners!
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => String(item.relation_id)}
          renderItem={renderMatch}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  list: { padding: 16, gap: 10 },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  matchAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchInfo: { flex: 1 },
  matchName: { fontSize: 16, fontWeight: '700' },
  matchMeta: { fontSize: 13, marginTop: 2 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginTop: 12 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 6 },
});
