import { GymBroColors } from '@/constants/theme';
import { currentUser } from '@/data/mock';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/gym-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Logo at top */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Profile Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image source={currentUser.photo} style={styles.avatar} />
            </View>

            {/* Name */}
            <Text style={styles.userName}>{currentUser.name}</Text>

            {/* Gym Name */}
            <Text style={styles.gymName}>{currentUser.gym}</Text>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/(tabs)/home')}
            >
              <Text style={styles.buttonText}>M O N   E S P A C E</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>FAQ | SUPPORT</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymBroColors.black,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 70,
    height: 70,
    tintColor: GymBroColors.white,
  },
  cardContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  card: {
    backgroundColor: GymBroColors.white,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: GymBroColors.greyBorder,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 36,
    fontWeight: '700',
    color: GymBroColors.black,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  gymName: {
    fontSize: 16,
    color: GymBroColors.greyText,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 30,
  },
  button: {
    backgroundColor: GymBroColors.accent,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: GymBroColors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    color: GymBroColors.white,
    fontSize: 14,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
});
