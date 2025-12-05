import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./app/screens/loginScreen";
import RegisterScreen from "./app/screens/registerScreen";
import UsersScreen from "./app/screens/usersScreen";
import ChatScreen from "./app/screens/chatScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Users: undefined;
  Chat: {
    myId: string;
    otherId: string;
    otherEmail: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: true, title: "Login" }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true, title: "Login" }}
        />

        <Stack.Screen
          name="Users"
          component={UsersScreen}
          options={{ headerShown: true,title: "Pengguna" }}
        />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({ title: "Chat dengan " + route.params.otherEmail})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
