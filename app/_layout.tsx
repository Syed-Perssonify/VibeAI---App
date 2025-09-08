import { UserProvider } from "@/hooks/user-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="intro"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: "Create Profile",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#FF8C42",
        }}
      />
      <Stack.Screen
        name="invite"
        options={{
          title: "Invite Friend",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#FF8C42",
        }}
      />
      <Stack.Screen
        name="swipe-demo"
        options={{
          title: "Choose Activities",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#FF8C42",
        }}
      />
      <Stack.Screen
        name="itinerary"
        options={{
          title: "Your Itinerary",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#FF8C42",
        }}
      />
      <Stack.Screen
        name="join/[sessionId]"
        options={{
          title: "Join Session",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#FF8C42",
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </UserProvider>
    </QueryClientProvider>
  );
}
