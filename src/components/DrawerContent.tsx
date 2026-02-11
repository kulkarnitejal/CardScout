import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DrawerContentProps {
  navigation: any;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, signOut, deleteAccount } = useAuth();

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
            navigation.closeDrawer();
          },
        },
      ]
    );
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
                        navigation.closeDrawer();
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

  const handleReportBug = () => {
    const email = 'kulkarni.tejal1+support@gmail.com'; // Replace with your support email
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
          'Unable to open email client. Please send an email to kulkarni.tejal1+support@gmail.com',
          [{ text: 'OK' }]
        );
      });

    navigation.closeDrawer();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        {user && (
          <Text style={styles.userEmail}>{user.email}</Text>
        )}
      </View>

      <ScrollView style={styles.content}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
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
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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

