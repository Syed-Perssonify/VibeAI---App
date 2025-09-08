import Button from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { Brain, MapPin, Star } from "lucide-react-native";
import React from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ItineraryScreen() {
  const { itinerary, userPersonality, friendPersonality } =
    useLocalSearchParams<{
      itinerary: string;
      userPersonality?: string;
      friendPersonality?: string;
    }>();
  const insets = useSafeAreaInsets();

  const handleStartOver = () => {
    router.replace("/home");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out our AI-generated outing plan!\n\n${itinerary}`,
        title: "Our Perfect Outing Plan",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Star size={32} color="#FF8C42" />
        <Text style={styles.title}>Your Perfect Outing</Text>
        <Text style={styles.subtitle}>
          AI-generated itinerary based on your preferences
        </Text>
      </View>

      {(userPersonality || friendPersonality) && (
        <View style={styles.personalityCard}>
          <Brain size={24} color="#FF8C42" />
          <Text style={styles.personalityTitle}>Personality Match</Text>
          {userPersonality && (
            <Text style={styles.personalityText}>You: {userPersonality}</Text>
          )}
          {friendPersonality && (
            <Text style={styles.personalityText}>
              Friend: {friendPersonality}
            </Text>
          )}
        </View>
      )}

      <View style={styles.itineraryCard}>
        <Text style={styles.itineraryText}>{itinerary}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Share with Friend"
          onPress={handleShare}
          size="large"
          style={styles.button}
        />

        <Button
          title="Plan Another Outing"
          variant="outline"
          onPress={handleStartOver}
          size="large"
          style={styles.button}
        />
      </View>

      <View style={styles.tipCard}>
        <MapPin size={20} color="#FF8C42" />
        <Text style={styles.tipText}>
          Tip: Save this itinerary and check opening hours before you go!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  itineraryCard: {
    backgroundColor: "#FFF5F0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  itineraryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  actions: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  personalityCard: {
    backgroundColor: "#F0F8FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  personalityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 12,
  },
  personalityText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
});
