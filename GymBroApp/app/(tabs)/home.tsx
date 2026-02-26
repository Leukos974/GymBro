import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GymBroColors } from '@/constants/theme';
import { currentUser, matches } from '@/data/mock';
import { Match } from '@/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMatchPress = (match: Match) => {
    setSelectedMatch(match);
    setShowPopup(true);
  };

  const handleGoToChat = () => {
    if (selectedMatch) {
      setShowPopup(false);
      router.push(`/chat/${selectedMatch.id}`);
    }
  };

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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="RECHERCHE..."
            placeholderTextColor={GymBroColors.greyText}
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={24} color={GymBroColors.greyText} style={styles.searchIcon} />
        </View>

        {/* Gym Banner */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>ON AIR</Text>
          <Text style={styles.bannerSubtitle}>O R I G I N A L   F I T N E S S</Text>
        </View>

        {/* VOS MATCHS Section */}
        <View style={styles.matchsSection}>
          <Text style={styles.matchsTitle}>VOS MATCHS</Text>
          <View style={styles.matchsDivider} />
        </View>

        {/* Match Cards */}
        {matches.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            {match.isTopMatch && (
              <Text style={styles.topMatchLabel}>TOP MATCH  🔥</Text>
            )}
            <View style={styles.matchCardContent}>
              <View style={styles.matchAvatarContainer}>
                <Image source={match.user.photo} style={styles.matchAvatar} />
                <Text style={styles.matchName}>{match.user.name}</Text>
              </View>
              <View style={styles.matchInfo}>
                <Text style={styles.matchLevel}>{match.user.level}</Text>
                <Text style={styles.matchDetail}>{match.user.objective}</Text>
                <Text style={styles.matchDetail}>{match.user.availability}</Text>
                <Text style={styles.matchGym}>{match.user.gym}</Text>
                <TouchableOpacity
                  style={styles.matchButton}
                  onPress={() => handleMatchPress(match)}
                >
                  <Text style={styles.matchButtonText}>Je Matche !</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Match Popup Modal */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPopup(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.popupCard}>
            {selectedMatch && (
              <>
                <Text style={styles.popupTopMatch}>TOP MATCH🔥</Text>

                {/* Avatar */}
                <View style={styles.popupAvatarContainer}>
                  <Image source={selectedMatch.user.photo} style={styles.popupAvatar} />
                </View>

                {/* Name */}
                <Text style={styles.popupName}>{selectedMatch.user.name}</Text>

                {/* Gym */}
                <Text style={styles.popupGym}>{selectedMatch.user.gym}</Text>

                {/* Description */}
                <Text style={styles.popupDescription}>{selectedMatch.user.description}</Text>

                {/* Details */}
                <View style={styles.popupDetails}>
                  <Text style={styles.popupLevel}>{selectedMatch.user.level}</Text>
                  <Text style={styles.popupDetailText}>{selectedMatch.user.objective}</Text>
                  <Text style={styles.popupDetailText}>Disponible ce soir en Salle</Text>
                </View>

                {/* CTA Button */}
                <TouchableOpacity style={styles.popupButton} onPress={handleGoToChat}>
                  <Text style={styles.popupButtonText}>Je Matche !</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymBroColors.white,
  },
  // ── Header ──────────────────────────────────────────
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
  // ── Scroll ──────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  // ── Search ──────────────────────────────────────────
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: GymBroColors.greyBorder,
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 48,
    backgroundColor: GymBroColors.white,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: GymBroColors.black,
  },
  searchIcon: {
    marginLeft: 8,
  },
  // ── Banner ──────────────────────────────────────────
  bannerContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: GymBroColors.black,
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    color: GymBroColors.white,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 6,
  },
  bannerSubtitle: {
    color: GymBroColors.white,
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 4,
  },
  // ── Matchs Section ─────────────────────────────────
  matchsSection: {
    marginTop: 24,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  matchsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: GymBroColors.primary,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  matchsDivider: {
    width: 60,
    height: 3,
    backgroundColor: GymBroColors.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  // ── Match Card ──────────────────────────────────────
  matchCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: GymBroColors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: GymBroColors.greyBorder,
  },
  topMatchLabel: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'serif',
    color: GymBroColors.black,
    marginBottom: 12,
  },
  matchCardContent: {
    flexDirection: 'row',
  },
  matchAvatarContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  matchAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: GymBroColors.greyBorder,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: GymBroColors.primary,
    marginTop: 8,
    fontFamily: 'serif',
  },
  matchInfo: {
    flex: 1,
  },
  matchLevel: {
    fontSize: 20,
    fontWeight: '800',
    color: GymBroColors.black,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  matchDetail: {
    fontSize: 13,
    color: GymBroColors.black,
    marginBottom: 2,
  },
  matchGym: {
    fontSize: 12,
    color: GymBroColors.greyText,
    marginTop: 4,
    fontWeight: '600',
  },
  matchButton: {
    alignSelf: 'flex-end',
    borderWidth: 1.5,
    borderColor: GymBroColors.black,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  matchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: GymBroColors.black,
  },
  // ── Popup Modal ─────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: GymBroColors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupCard: {
    backgroundColor: GymBroColors.white,
    borderRadius: 20,
    padding: 30,
    width: width * 0.88,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  popupTopMatch: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'serif',
    color: GymBroColors.black,
    marginBottom: 16,
  },
  popupAvatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: GymBroColors.greyBorder,
    marginBottom: 12,
  },
  popupAvatar: {
    width: '100%',
    height: '100%',
  },
  popupName: {
    fontSize: 24,
    fontWeight: '700',
    color: GymBroColors.accent,
    fontFamily: 'serif',
  },
  popupGym: {
    fontSize: 13,
    color: GymBroColors.greyText,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
    marginBottom: 16,
  },
  popupDescription: {
    fontSize: 15,
    color: GymBroColors.black,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  popupDetails: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  popupLevel: {
    fontSize: 18,
    fontWeight: '800',
    color: GymBroColors.black,
    marginBottom: 4,
  },
  popupDetailText: {
    fontSize: 14,
    color: GymBroColors.black,
    marginBottom: 2,
  },
  popupButton: {
    backgroundColor: GymBroColors.accent,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  popupButtonText: {
    color: GymBroColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
