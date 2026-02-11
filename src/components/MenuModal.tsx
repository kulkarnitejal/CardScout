import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MenuModalNavigationProp = CompositeNavigationProp<
  any,
  StackNavigationProp<RootStackParamList>
>;

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MenuModalNavigationProp>();
  const { user, signOut, deleteAccount } = useAuth();
  const slideAnim = useRef(new Animated.Value(-280)).current; // Start off-screen to the left
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      // Show modal and reset animation position, then slide in from left
      setModalVisible(true);
      slideAnim.setValue(-280);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out to left, then hide modal after animation completes
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim]);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            onClose();
          },
        },
      ]
    );
  };

  const handleReportBug = () => {
    const email = 'support@cardscout.com';
    const subject = encodeURIComponent('Bug Report / Feature Request');
    const body = encodeURIComponent(
      `Please describe the bug or feature request:\n\n` +
      `User: ${user?.email || 'Not logged in'}\n` +
      `App Version: 1.0.0\n\n`
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            'Email Not Available',
            'Please send an email to support@cardscout.com',
            [{ text: 'OK' }]
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Error',
          'Unable to open email client. Please send an email to support@cardscout.com',
          [{ text: 'OK' }]
        );
      });

    onClose();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data including transactions, bank connections, and account information will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Second confirmation to ensure user really wants to delete
            Alert.alert(
              'Confirm Deletion',
              'Are you absolutely sure you want to delete your account? This will permanently remove all your data.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes, Delete My Account',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      const { error } = await deleteAccount();
                      if (error) {
                        Alert.alert(
                          'Error',
                          error.message || 'Failed to delete account. Please try again or contact support.',
                          [{ text: 'OK' }]
                        );
                      } else {
                        Alert.alert(
                          'Account Deleted',
                          'Your account and all associated data have been deleted.',
                          [{ text: 'OK' }]
                        );
                        onClose();
                      }
                    } catch (error: any) {
                      Alert.alert(
                        'Error',
                        'An unexpected error occurred. Please try again or contact support.',
                        [{ text: 'OK' }]
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.drawer,
                { paddingTop: insets.top },
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              {user && (
                <Text style={styles.userEmail}>{user.email}</Text>
              )}

              <ScrollView style={styles.content}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    navigation.navigate('PrivacyPolicy');
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="shield-lock"
                    size={24}
                    color={COLORS.text}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Privacy Policy</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleReportBug}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="bug"
                    size={24}
                    color={COLORS.text}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Report Bug / Request Feature</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleDeleteAccount}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="account-remove"
                    size={24}
                    color={COLORS.error}
                    style={styles.menuIcon}
                  />
                  <Text style={[styles.menuText, styles.deleteAccountText]}>Delete Account</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color={COLORS.error}
                    style={styles.menuIcon}
                  />
                  <Text style={[styles.menuText, styles.signOutText]}>Sign Out</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  drawer: {
    width: 280,
    height: '100%',
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: COLORS.text,
  },
  signOutText: {
    color: COLORS.error,
  },
  deleteAccountText: {
    color: COLORS.error,
  },
});

