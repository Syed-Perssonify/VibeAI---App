import Button from "@/components/buttom";
import SwipeCard from "@/components/SwipeCard";
import {
  assessPersonality,
  generateCompatibleItinerary,
} from "@/constants/vibes";
import { useUser } from "@/hooks/user-store";
import { SwipeResult } from "@/types/user";
import { router } from "expo-router";
import { Heart, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SwipeDemoScreen() {
  const { user, currentSession, updateSession } = useUser();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<SwipeResult[]>([]);
  const [generatingItinerary, setGeneratingItinerary] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      Alert.alert("Error", "No active session found", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [currentSession]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentSession || !user) return;

    const currentImage = currentSession.images[currentIndex];
    const swipeResult: SwipeResult = {
      imageId: currentImage.id,
      direction,
      timestamp: Date.now(),
      vibeType: currentImage.vibeType,
    };

    const updatedSwipes = [...swipes, swipeResult];
    setSwipes(updatedSwipes);
    setCurrentIndex((prev) => prev + 1);

    // Update session with user's swipes
    const sessionSwipes = { ...currentSession.swipes };
    sessionSwipes[user.id] = updatedSwipes;

    await updateSession(currentSession.id, { swipes: sessionSwipes });

    if (currentIndex >= currentSession.images.length - 1) {
      await generateItinerary(updatedSwipes);
    }
  };

  const generateItinerary = async (userSwipes: SwipeResult[]) => {
    if (!currentSession || !user) return;

    setGeneratingItinerary(true);
    try {
      console.log("Generating itinerary with swipes:", userSwipes);

      // Assess user's personality based on swipes
      const userPersonality = assessPersonality(userSwipes);
      console.log("User personality assessed:", userPersonality.name);

      // For demo mode, create a mock friend personality
      const friendSwipes = currentSession.images.map(() => ({
        vibeType:
          currentSession.images[
            Math.floor(Math.random() * currentSession.images.length)
          ].vibeType,
        direction: Math.random() > 0.4 ? "right" : ("left" as "left" | "right"),
      }));

      const friendPersonality = assessPersonality(friendSwipes);
      console.log("Friend personality assessed:", friendPersonality.name);

      // Get preferences from swipes
      const userPreferences = userSwipes
        .filter((s) => s.direction === "right")
        .map((s) => s.vibeType);
      const friendPreferences = friendSwipes
        .filter((s) => s.direction === "right")
        .map((s) => s.vibeType);

      console.log("Generating compatible itinerary...");
      const itinerary = await generateCompatibleItinerary(
        userPersonality,
        friendPersonality,
        user.location,
        userPreferences,
        friendPreferences
      );

      // Update session with results
      await updateSession(currentSession.id, {
        status: "completed",
        itinerary,
        personalityAssessments: {
          [user.id]: userPersonality,
          [currentSession.users[1]]: friendPersonality,
        },
      });

      console.log("Itinerary generated, navigating...");
      router.push({
        pathname: "/itinerary",
        params: {
          itinerary,
          userPersonality: userPersonality.name,
          friendPersonality: friendPersonality.name,
        },
      });
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      Alert.alert("Error", "Failed to generate itinerary. Please try again.");
    } finally {
      setGeneratingItinerary(false);
    }
  };

  if (!currentSession) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading session...</Text>
      </View>
    );
  }

  if (generatingItinerary) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Analyzing preferences and creating your perfect outing...
        </Text>
      </View>
    );
  }

  if (currentIndex >= currentSession.images.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Processing your choices...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Swipe to Choose</Text>
          <Text style={styles.sessionInfo}>
            Session with {currentSession.userNames[1]}
          </Text>
        </View>
        <Text style={styles.counter}>
          {currentIndex + 1} / {currentSession.images.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {currentSession.images
          .slice(currentIndex, currentIndex + 2)
          .map((image, index) => (
            <SwipeCard
              key={image.id}
              image={image}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
      </View>

      <View style={styles.actions}>
        <Button
          title=""
          onPress={() => handleSwipe("left")}
          variant="outline"
          style={[styles.actionButton, styles.rejectButton]}
          textStyle={styles.actionButtonText}
        >
          <X size={24} color="#FF6B6B" />
        </Button>

        <Button
          title=""
          onPress={() => handleSwipe("right")}
          variant="outline"
          style={[styles.actionButton, styles.likeButton]}
          textStyle={styles.actionButtonText}
        >
          <Heart size={24} color="#FFFFFF" />
        </Button>
      </View>

      <Text style={styles.instruction}>
        Swipe right if you&apos;d enjoy this activity, left if not
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  sessionInfo: {
    fontSize: 14,
    color: "#FF8C42",
    marginTop: 4,
  },
  counter: {
    fontSize: 16,
    color: "#666",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginVertical: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    borderColor: "#FF6B6B",
  },
  likeButton: {
    backgroundColor: "#FF8C42",
  },
  actionButtonText: {
    fontSize: 0,
  },
  instruction: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
});
