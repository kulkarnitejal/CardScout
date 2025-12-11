import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { RecommendationsScreen } from '../screens/RecommendationsScreen';
import { GiftCardDetailScreen } from '../screens/GiftCardDetailScreen';
import { PlaidConnectScreen } from '../screens/PlaidConnectScreen';
import { COLORS } from '../utils/constants';

export type RootStackParamList = {
  Home: undefined;
  Transactions: undefined;
  Recommendations: undefined;
  GiftCardDetail: { recommendation: any };
  PlaidConnect: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
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
          name="Recommendations"
          component={RecommendationsScreen}
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
        <Stack.Screen
          name="PlaidConnect"
          component={PlaidConnectScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

