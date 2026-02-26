import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EXERCISE_TYPE_META, ExerciseType } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GYMS = [
  { id: 1, name: 'FitPark Central', location: 'Paris 1er' },
  { id: 2, name: 'IronHouse', location: 'Lyon 3e' },
  { id: 3, name: 'Muscle Factory', location: 'Marseille 6e' },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [selectedType, setSelectedType] = useState<ExerciseType | ''>('');
  const [selectedGymId, setSelectedGymId] = useState<number | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings & Filters</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Age Range ─────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Age Range</Text>
        <View style={styles.ageRow}>
          <View style={styles.ageField}>
            <Text style={[styles.ageLabel, { color: colors.textSecondary }]}>Min</Text>
            <View style={styles.ageControls}>
              <TouchableOpacity
                style={[styles.ageBtn, { borderColor: colors.border }]}
                onPress={() => setMinAge((v) => Math.max(16, v - 1))}
              >
                <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.ageValue, { color: colors.text }]}>{minAge}</Text>
              <TouchableOpacity
                style={[styles.ageBtn, { borderColor: colors.border }]}
                onPress={() => setMinAge((v) => Math.min(maxAge, v + 1))}
              >
                <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ageField}>
            <Text style={[styles.ageLabel, { color: colors.textSecondary }]}>Max</Text>
            <View style={styles.ageControls}>
              <TouchableOpacity
                style={[styles.ageBtn, { borderColor: colors.border }]}
                onPress={() => setMaxAge((v) => Math.max(minAge, v - 1))}
              >
                <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.ageValue, { color: colors.text }]}>{maxAge}</Text>
              <TouchableOpacity
                style={[styles.ageBtn, { borderColor: colors.border }]}
                onPress={() => setMaxAge((v) => Math.min(60, v + 1))}
              >
                <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Training Type Filter ─────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Training Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeChip,
              {
                borderColor: colors.border,
                backgroundColor: selectedType === '' ? colors.accent + '22' : 'transparent',
              },
            ]}
            onPress={() => setSelectedType('')}
          >
            <Text style={[styles.typeChipText, { color: selectedType === '' ? colors.accent : colors.textSecondary }]}>
              All
            </Text>
          </TouchableOpacity>
          {(Object.keys(EXERCISE_TYPE_META) as ExerciseType[]).map((t) => {
            const meta = EXERCISE_TYPE_META[t];
            const active = selectedType === t;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeChip,
                  {
                    borderColor: meta.color,
                    backgroundColor: active ? meta.color + '22' : 'transparent',
                  },
                ]}
                onPress={() => setSelectedType(t)}
              >
                <MaterialCommunityIcons name={meta.icon as any} size={14} color={meta.color} />
                <Text style={[styles.typeChipText, { color: meta.color }]}>{meta.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Gym Filter ───────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Gym</Text>
        <TouchableOpacity
          style={[
            styles.gymOption,
            {
              borderColor: colors.border,
              backgroundColor: selectedGymId === null ? colors.accent + '22' : colors.card,
            },
          ]}
          onPress={() => setSelectedGymId(null)}
        >
          <Text style={{ color: selectedGymId === null ? colors.accent : colors.text, fontWeight: '600' }}>
            All Gyms
          </Text>
        </TouchableOpacity>
        {GYMS.map((gym) => {
          const active = selectedGymId === gym.id;
          return (
            <TouchableOpacity
              key={gym.id}
              style={[
                styles.gymOption,
                {
                  borderColor: active ? colors.accent : colors.border,
                  backgroundColor: active ? colors.accent + '22' : colors.card,
                },
              ]}
              onPress={() => setSelectedGymId(gym.id)}
            >
              <View>
                <Text style={{ color: active ? colors.accent : colors.text, fontWeight: '600' }}>
                  {gym.name}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                  {gym.location}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color={active ? colors.accent : colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}

        {/* ── Apply button ──────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.back()}
        >
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  ageRow: { flexDirection: 'row', gap: 24 },
  ageField: { alignItems: 'center' },
  ageLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  ageControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageValue: { fontSize: 20, fontWeight: '700', minWidth: 32, textAlign: 'center' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  typeChipText: { fontSize: 12, fontWeight: '700' },
  gymOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  applyBtn: {
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
