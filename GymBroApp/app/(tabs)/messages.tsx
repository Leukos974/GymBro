import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GymBroColors } from '@/constants/theme';
import { currentUser, conversations } from '@/data/mock';

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>GYMBRO</Text>
          <Text style={styles.headerSubtitle}>L A   R É U N I O N</Text>
        </View>
        <TouchableOpacity style={styles.headerAvatar}>
          <Image source={currentUser.photo} style={styles.headerAvatarImg} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>MESSAGES</Text>
        <View style={styles.titleDivider} />
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const lastMessage = item.messages[item.messages.length - 1];
          const isFromMe = lastMessage.fromUserId === currentUser.id;
          const preview = lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '');

          return (
            <TouchableOpacity
              style={styles.conversationCard}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <View style={styles.convAvatarContainer}>
                <Image source={item.matchUser.photo} style={styles.convAvatar} />
              </View>
              <View style={styles.convInfo}>
                <Text style={styles.convName}>{item.matchUser.name}</Text>
                <Text style={styles.convPreview} numberOfLines={1}>
                  {isFromMe ? 'Vous: ' : ''}{preview}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={GymBroColors.greyText} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymBroColors.white,
  },
  header: {
    backgroundColor: GymBroColors.headerBg,
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: GymBroColors.primary,
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    color: GymBroColors.primary,
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GymBroColors.primary,
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: GymBroColors.primary,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  titleDivider: {
    width: 60,
    height: 3,
    backgroundColor: GymBroColors.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GymBroColors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: GymBroColors.greyBorder,
  },
  convAvatarContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GymBroColors.greyBorder,
    marginRight: 14,
  },
  convAvatar: {
    width: '100%',
    height: '100%',
  },
  convInfo: {
    flex: 1,
  },
  convName: {
    fontSize: 17,
    fontWeight: '700',
    color: GymBroColors.black,
    marginBottom: 4,
  },
  convPreview: {
    fontSize: 13,
    color: GymBroColors.greyText,
  },
});
