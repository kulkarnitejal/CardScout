import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS } from '../utils/constants';
// @ts-ignore - @expo/vector-icons is available in Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PrivacyPolicyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<PrivacyPolicyScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last updated: 12/27/2025</Text>

        <Text style={styles.intro}>
          This Privacy Policy describes how CardScout ("we," "us," or "our") collects, uses, discloses, and protects personal information when you use our application and services (the "Services").
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          
          <Text style={styles.subsectionTitle}>1.1 Information You Provide</Text>
          <Text style={styles.bodyText}>
            • Account information such as your name and email address.{'\n'}
            • Any information you voluntarily submit through the Services.
          </Text>

          <Text style={styles.subsectionTitle}>1.2 Information Accessed via Plaid</Text>
          <Text style={styles.bodyText}>
            When you connect a financial account through Plaid, we may receive the following information, depending on the permissions you grant:
          </Text>
          <Text style={styles.bodyText}>
            • Transaction data (merchant name, date, amount, category).{'\n'}
            • Account metadata (institution name, account type).{'\n'}
            • Account balances.
          </Text>
          <Text style={styles.bodyText}>
            We do not receive or store your bank login credentials. Those credentials are handled directly by Plaid.
          </Text>
          <Text style={styles.bodyText}>
            Plaid's Privacy Policy is available at:{'\n'}
            https://plaid.com/legal/#privacy-policy
          </Text>

          <Text style={styles.subsectionTitle}>1.3 Automatically Collected Information</Text>
          <Text style={styles.bodyText}>
            Device and usage information such as IP address, browser type, and interaction logs.
          </Text>
          <Text style={styles.bodyText}>
            This data is used for security, fraud prevention, and service reliability.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Information</Text>
          <Text style={styles.bodyText}>
            We use personal information solely to:
          </Text>
          <Text style={styles.bodyText}>
            • Provide, operate, and improve the Services.{'\n'}
            • Analyze spending patterns to deliver savings recommendations.{'\n'}
            • Maintain security and prevent fraud.{'\n'}
            • Comply with legal obligations.
          </Text>
          <Text style={styles.bodyText}>
            We do not sell personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Share Information</Text>
          <Text style={styles.bodyText}>
            We share personal information only in the following circumstances:
          </Text>
          <Text style={styles.bodyText}>
            • Service Providers: With vendors who perform services on our behalf (e.g., cloud hosting, analytics), under contractual confidentiality obligations.{'\n'}
            • Legal Requirements: If required to comply with law, regulation, or legal process.{'\n'}
            • Business Transfers: In connection with a merger, acquisition, or asset sale, subject to confidentiality protections.
          </Text>
          <Text style={styles.bodyText}>
            We do not share financial data with advertisers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Retention</Text>
          <Text style={styles.bodyText}>
            We retain personal information only for as long as necessary to provide the Services and fulfill the purposes described in this policy, unless a longer retention period is required by law.
          </Text>
          <Text style={styles.bodyText}>
            When a user deletes their account, all associated personal data is permanently deleted from our systems, including financial data accessed via Plaid, except where retention is required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.bodyText}>
            We implement administrative, technical, and physical safeguards designed to protect personal information, including:
          </Text>
          <Text style={styles.bodyText}>
            • Encryption in transit and at rest.{'\n'}
            • Restricted access controls.{'\n'}
            • Regular monitoring for unauthorized access.
          </Text>
          <Text style={styles.bodyText}>
            No system is completely secure; however, we take reasonable measures to protect your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
          <Text style={styles.bodyText}>
            Depending on your location, you may have the right to:
          </Text>
          <Text style={styles.bodyText}>
            • Access the personal information we hold about you.{'\n'}
            • Request correction of inaccurate information.{'\n'}
            • Delete your account and associated personal data.{'\n'}
            • Withdraw consent for financial account access.
          </Text>
          <Text style={styles.bodyText}>
            Account deletion results in permanent removal of user data as described in Section 4.
          </Text>
          <Text style={styles.bodyText}>
            California residents may exercise rights under the California Consumer Privacy Act (CCPA), including the right to know and the right to delete.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.bodyText}>
            To ask questions or exercise your privacy rights, including account deletion, contact:
          </Text>
          <Text style={styles.bodyText}>
            Email: kulkarni.tejal1+privacy@gmail.com{'\n'}
            Company Name: CardScout
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
          <Text style={styles.bodyText}>
            We may update this Privacy Policy from time to time. We will post the updated version with a revised "Last updated" date.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 2,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: 4,
  },
  backButtonPlaceholder: {
    width: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
});

