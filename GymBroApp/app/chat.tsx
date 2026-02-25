import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ChatMessage {
  id: string;
  content: string;
  fromMe: boolean;
  time: string;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { partnerName } = useLocalSearchParams<{ relationId: string; partnerName: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', content: 'Hey! Ready to hit the gym tomorrow? 💪', fromMe: false, time: '10:30' },
    { id: '2', content: 'Absolutely! What time works for you?', fromMe: true, time: '10:32' },
    { id: '3', content: 'How about 7am? Leg day 🦵', fromMe: false, time: '10:33' },
  ]);
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        content: text.trim(),
        fromMe: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setText('');
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.bubble,
        item.fromMe ? styles.bubbleMe : styles.bubbleThem,
        {
          backgroundColor: item.fromMe ? colors.accent : colors.card,
          borderColor: item.fromMe ? colors.accent : colors.border,
        },
      ]}
    >
      <Text style={{ color: item.fromMe ? '#FFF' : colors.text, fontSize: 15 }}>
        {item.content}
      </Text>
      <Text
        style={[
          styles.time,
          { color: item.fromMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary },
        ]}
      >
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{partnerName || 'Chat'}</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.background }]}
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.accent }]} onPress={sendMessage}>
            <MaterialCommunityIcons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  messageList: { padding: 16, gap: 8 },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  bubbleMe: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleThem: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  time: { fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
