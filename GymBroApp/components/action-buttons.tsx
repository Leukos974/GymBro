import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
}

export function ActionButtons({ onPass, onLike }: ActionButtonsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.passButton, { borderColor: colors.accent }]}
        onPress={onPass}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="close" size={36} color={colors.accent} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton, { borderColor: colors.success }]}
        onPress={onLike}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="check" size={36} color={colors.success} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 16,
  },
  button: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  passButton: {},
  likeButton: {},
});
