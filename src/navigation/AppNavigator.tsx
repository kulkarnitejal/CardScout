import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { RecommendationsScreen } from '../screens/RecommendationsScreen';
import { GiftCardDetailScreen } from '../screens/GiftCardDetailScreen';
import { PlaidConnectScreen } from '../screens/PlaidConnectScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { BottomTabBar } from '../components/BottomTabBar';
import { COLORS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  Back: { screen?: keyof BackParamList } | undefined;
  Transactions: undefined;
  GiftCardDetail: { recommendation: any };
};

export type BackParamList = {
  Home: undefined;
  Benefits: undefined;
  ConnectBank: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BackParamList>();

const BackNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Benefits" component={RecommendationsScreen} />
      <Tab.Screen name="ConnectBank" component={PlaidConnectScreen} />
    </Tab.Navigator>
  );
};

const AuthStack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: '#fff',
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Sign Up',
        }}
      />
    </AuthStack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
        }}
      >
        {user ? (
          // User is logged in - show main app
          <>
        <Stack.Screen
          name="Back"
          component={BackNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GiftCardDetail"
          component={GiftCardDetailScreen}
          options={{
            title: 'Gift Card Details',
          }}
        />
          </>
        ) : (
          // User is not logged in - show auth screens
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

