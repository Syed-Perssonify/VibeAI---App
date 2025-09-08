import { useUser } from "@/hooks/user-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IndexScreen() {
  const { user, loading } = useUser();
  const insets = useSafeAreaInsets();
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);

  useEffect(() => {
    checkIntroStatus();
  }, []);

  useEffect(() => {
    if (!loading && hasSeenIntro !== null) {
      if (user) {
        router.replace("/home");
      } else if (hasSeenIntro) {
        router.replace("/onboarding");
      } else {
        router.replace("/intro");
      }
    }
  }, [user, loading, hasSeenIntro]);

  const checkIntroStatus = async () => {
    try {
      // Clear storage if it's getting too full
      const keys = await AsyncStorage.getAllKeys();
      const storage = await AsyncStorage.multiGet(keys);
      const totalSize = storage.reduce((acc, [key, value]) => {
        return acc + (value ? value.length : 0);
      }, 0);

      // If storage is over 2MB, clear sessions
      if (totalSize > 2000000) {
        console.log("Storage size exceeded, clearing old sessions...");
        await AsyncStorage.removeItem("sessions");
      }

      const introSeen = await AsyncStorage.getItem("hasSeenIntro");
      setHasSeenIntro(introSeen === "true");
    } catch (error) {
      console.error("Error checking storage:", error);
      setHasSeenIntro(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ActivityIndicator size="large" color="#FF8C42" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
