import Button from "@/components/buttom";
import Input from "@/components/input";
import { useUser } from "@/hooks/user-store";
import { User } from "@/types/user";
import { router, useLocalSearchParams } from "expo-router";
import { UserPlus, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JoinSessionScreen() {
  const { invite } = useLocalSearchParams<{
    sessionId: string;
    invite?: string;
  }>();
  const { user, inviteLinks, createSwipeSession } = useUser();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [friendData, setFriendData] = useState({
    name: "",
    age: "",
    location: "",
    gender: "",
  });

  const inviteLink = invite
    ? inviteLinks.find((link) => link.id === invite)
    : null;
  const isValidInvite =
    inviteLink && !inviteLink.used && inviteLink.expiresAt > Date.now();

  useEffect(() => {
    if (!user) {
      Alert.alert(
        "Account Required",
        "You need to create an account first to join a session.",
        [
          {
            text: "Create Account",
            onPress: () => router.replace("/onboarding"),
          },
          { text: "Cancel", onPress: () => router.back() },
        ]
      );
    }
  }, [user]);

  const handleJoinSession = async () => {
    if (!user) return;

    if (
      !friendData.name ||
      !friendData.age ||
      !friendData.location ||
      !friendData.gender
    ) {
      Alert.alert("Error", "Please fill in all your details");
      return;
    }

    setLoading(true);
    try {
      // Create user profile for the joining friend
      const friendUser: User = {
        id: `friend_${Date.now()}`,
        name: friendData.name,
        age: parseInt(friendData.age),
        location: friendData.location,
        gender: friendData.gender,
        interests: ["Adventure Sports", "Food & Dining", "Music"], // Default interests
        profileComplete: true,
      };

      // Create the session
      await createSwipeSession(friendUser, invite);

      Alert.alert(
        "Session Joined!",
        `You've successfully joined ${inviteLink?.inviterName}'s outing planning session.`,
        [{ text: "Start Swiping", onPress: () => router.push("/swipe-demo") }]
      );
    } catch (error) {
      console.error("Failed to join session:", error);
      Alert.alert("Error", "Failed to join session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isValidInvite) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.content}>
          <Users size={64} color="#FF6B6B" />
          <Text style={styles.title}>Invalid Invitation</Text>
          <Text style={styles.subtitle}>
            This invitation link is either expired, already used, or invalid.
          </Text>
          <Button
            title="Go Home"
            onPress={() => router.replace("/(tabs)/home")}
            style={styles.button}
          />
        </View>
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
      <View style={styles.content}>
        <UserPlus size={64} color="#FF8C42" />

        <Text style={styles.title}>
          Join {inviteLink.inviterName}&apos;s Session
        </Text>
        <Text style={styles.subtitle}>
          Complete your profile to start planning the perfect outing together
        </Text>

        <View style={styles.form}>
          <Input
            label="Your Name"
            value={friendData.name}
            onChangeText={(name) =>
              setFriendData((prev) => ({ ...prev, name }))
            }
            placeholder="Enter your name"
          />

          <Input
            label="Age"
            value={friendData.age}
            onChangeText={(age) => setFriendData((prev) => ({ ...prev, age }))}
            placeholder="Enter your age"
            keyboardType="numeric"
          />

          <Input
            label="Location"
            value={friendData.location}
            onChangeText={(location) =>
              setFriendData((prev) => ({ ...prev, location }))
            }
            placeholder="Enter your city"
          />

          <Input
            label="Gender"
            value={friendData.gender}
            onChangeText={(gender) =>
              setFriendData((prev) => ({ ...prev, gender }))
            }
            placeholder="Enter your gender"
          />

          <Button
            title={loading ? "Joining Session..." : "Join Session"}
            onPress={handleJoinSession}
            disabled={loading}
            size="large"
            style={styles.button}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            1. You&apos;ll swipe on activity images{"\n"}
            2. AI analyzes both your preferences{"\n"}
            3. Get a personalized outing plan for both of you
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    width: "100%",
    marginBottom: 32,
  },
  button: {
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: "#FFF5F0",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
