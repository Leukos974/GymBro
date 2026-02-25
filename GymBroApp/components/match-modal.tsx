import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MatchModalProps {
  visible: boolean;
  matchedName: string;
  onClose: () => void;
}

export function MatchModal({ visible, matchedName, onClose }: MatchModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="heart-multiple" size={64} color={colors.accent} />
          <Text style={[styles.title, { color: colors.accent }]}>It's a Match! 🎉</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            You and {matchedName} both want to train together!
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: Dimensions.get('window').width * 0.85,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
