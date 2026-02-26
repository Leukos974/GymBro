import { GymBroColors } from '@/constants/theme';
import { conversations, currentUser } from '@/data/mock';
import { Message } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const conversation = conversations.find((c) => c.id === Number(id));
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>(
    conversation?.messages ?? []
  );
  const [inputText, setInputText] = useState('');

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text>Conversation introuvable</Text>
      </View>
    );
  }

  const matchUser = conversation.matchUser;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      fromUserId: currentUser.id,
      toUserId: matchUser.id,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.fromUserId === currentUser.id;
    const senderPhoto = isMe ? currentUser.photo : matchUser.photo;
    const senderName = isMe ? currentUser.name : matchUser.name;

    return (
      <View style={styles.messageRow}>
        {/* Sender Name */}
        <Text style={[styles.senderName, isMe ? styles.senderNameRight : styles.senderNameLeft]}>
          {senderName}
        </Text>
        <View
          style={[
            styles.messageContainer,
            isMe ? styles.messageRight : styles.messageLeft,
          ]}
        >
          {/* Bubble */}
          <View
            style={[
              styles.bubble,
              isMe ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>

          {/* Avatar */}
          <View
            style={[
              styles.messageAvatarContainer,
              isMe ? styles.avatarRight : styles.avatarLeft,
            ]}
          >
            <Image source={senderPhoto} style={styles.messageAvatar} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={GymBroColors.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>GYMBRO</Text>
            <Text style={styles.headerSubtitle}>L A   R É U N I O N</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAvatar}>
          <Image source={currentUser.photo} style={styles.headerAvatarImg} />
        </TouchableOpacity>
      </View>

      {/* Search icon row */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={24} color={GymBroColors.greyText} />
      </View>

      {/* Date separator */}
      <View style={styles.dateSeparator}>
        <Text style={styles.dateText}>Aujourd'hui</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ECRIVEZ UN MESSAGE..."
            placeholderTextColor={GymBroColors.greyText}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={22} color={GymBroColors.greyText} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymBroColors.white,
  },
  // ── Header ──────────────────────────────────────────
  header: {
    backgroundColor: GymBroColors.white,
    paddingTop: 55,
    paddingBottom: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: GymBroColors.primary,
    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    color: GymBroColors.primary,
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '600',
    marginTop: 2,
  },
  headerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GymBroColors.primary,
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
  },
  // ── Search Row ──────────────────────────────────────
  searchRow: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GymBroColors.greyBorder,
  },
  // ── Date Separator ──────────────────────────────────
  dateSeparator: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 14,
    color: GymBroColors.greyText,
  },
  // ── Messages ────────────────────────────────────────
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  messageRow: {
    marginBottom: 20,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '700',
    color: GymBroColors.black,
    marginBottom: 6,
  },
  senderNameRight: {
    textAlign: 'right',
    marginRight: 60,
  },
  senderNameLeft: {
    textAlign: 'left',
    marginLeft: 60,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: width * 0.80,
  },
  messageRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  messageLeft: {
    alignSelf: 'flex-start',
    flexDirection: 'row-reverse',
  },
  bubble: {
    backgroundColor: GymBroColors.accent,
    borderRadius: 20,
    padding: 16,
    maxWidth: width * 0.65,
  },
  bubbleRight: {
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: GymBroColors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  messageAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: GymBroColors.greyBorder,
  },
  avatarRight: {
    marginLeft: 8,
  },
  avatarLeft: {
    marginRight: 8,
  },
  messageAvatar: {
    width: '100%',
    height: '100%',
  },
  // ── Input Bar ───────────────────────────────────────
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: GymBroColors.greyBorder,
    backgroundColor: GymBroColors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: GymBroColors.greyBorder,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: GymBroColors.black,
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },
});
