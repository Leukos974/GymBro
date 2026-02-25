import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExerciseType, EXERCISE_TYPE_META } from '@/types';

const EXOS_OPTIONS = [
  'Bench', 'Squat', 'Deadlift', 'OHP', 'Push', 'Pull', 'Legs',
  'Back', 'Arms', 'Glutes', 'Running', 'Cycling', 'HIIT',
  'Yoga', 'Handstand', 'Rings',
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [name, setName] = useState('Alex');
  const [familyName, setFamilyName] = useState('Dupont');
  const [age, setAge] = useState('24');
  const [type, setType] = useState<ExerciseType>('mass_gain');
  const [description, setDescription] = useState(
    'Looking for a gym buddy to push through heavy sets!',
  );
  const [selectedExos, setSelectedExos] = useState<string[]>(['Bench', 'Squat', 'Deadlift']);

  const toggleExo = (exo: string) => {
    setSelectedExos((prev) => {
      if (prev.includes(exo)) return prev.filter((e) => e !== exo);
      if (prev.length >= 3) return prev;
      return [...prev, exo];
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push('/matches')}>
          <MaterialCommunityIcons name="heart-multiple-outline" size={26} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar placeholder */}
          <View style={[styles.avatar, { backgroundColor: colors.border }]}>
            <MaterialCommunityIcons name="camera-plus-outline" size={40} color={colors.textSecondary} />
            <Text style={[styles.avatarText, { color: colors.textSecondary }]}>Add Photo</Text>
          </View>

          {/* Fields */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>First Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Family Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={familyName}
            onChangeText={setFamilyName}
            placeholder="Family name"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Age</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Exercise Type */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Training Focus</Text>
          <View style={styles.typeRow}>
            {(Object.keys(EXERCISE_TYPE_META) as ExerciseType[]).map((t) => {
              const meta = EXERCISE_TYPE_META[t];
              const active = type === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeChip,
                    { borderColor: meta.color, backgroundColor: active ? meta.color + '22' : 'transparent' },
                  ]}
                  onPress={() => setType(t)}
                >
                  <MaterialCommunityIcons name={meta.icon as any} size={16} color={meta.color} />
                  <Text style={[styles.typeChipText, { color: meta.color }]}>{meta.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Description */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell gym partners about you…"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          {/* Exos Selection */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Favourite Exercises (max 3)
          </Text>
          <View style={styles.exosGrid}>
            {EXOS_OPTIONS.map((exo) => {
              const active = selectedExos.includes(exo);
              return (
                <TouchableOpacity
                  key={exo}
                  style={[
                    styles.exoChip,
                    {
                      backgroundColor: active ? colors.accent : colors.card,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => toggleExo(exo)}
                >
                  <Text style={{ color: active ? '#FFF' : colors.text, fontWeight: '600', fontSize: 13 }}>
                    {exo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]}>
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: { fontSize: 12, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
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
  exosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  exoChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  saveBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
