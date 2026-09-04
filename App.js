import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/constants/colors';

import HomeScreen from './src/screens/HomeScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import EditBookScreen from './src/screens/EditBookScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" backgroundColor={colors.primary} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Novo Livro' }} />
        <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'Editar Livro' }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalhes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}