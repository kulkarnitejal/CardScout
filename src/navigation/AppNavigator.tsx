import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { RecommendationsScreen } from '../screens/RecommendationsScreen';
import { GiftCardDetailScreen } from '../screens/GiftCardDetailScreen';
import { PlaidConnectScreen } from '../screens/PlaidConnectScreen';
import { BottomTabBar } from '../components/BottomTabBar';
import { COLORS } from '../utils/constants';

export type RootStackParamList = {
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

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Back"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
        }}
      >
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

