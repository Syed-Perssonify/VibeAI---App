import Button from "@/components/buttom";
import Input from "@/components/input";
import { useUser } from "@/hooks/user-store";
import { User } from "@/types/user";
import { router } from "expo-router";
import { Share2, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Share, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InviteScreen() {
  const { user, createInviteLink, createSwipeSession } = useUser();
  const insets = useSafeAreaInsets();
  const [friendName, setFriendName] = useState("");
  const [friendAge, setFriendAge] = useState("");
  const [friendLocation, setFriendLocation] = useState("");
  const [friendGender, setFriendGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!friendName.trim()) {
      Alert.alert("Error", "Please enter your friend's name");
      return;
    }

    setLoading(true);
    try {
      const inviteLink = await createInviteLink(friendName);
      const shareUrl = `https://outingplanner.app/join/${inviteLink.sessionId}?invite=${inviteLink.id}`;

      await Share.share({
        message: `Hey ${friendName}! ${user?.name} wants to plan an outing with you. Join here: ${shareUrl}`,
        title: "Plan an Outing Together!",
      });

      Alert.alert(
        "Invitation Sent!",
        "Your friend will receive the invitation. Once they join, you can start planning together!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Failed to create invite:", error);
      Alert.alert("Error", "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDemo = async () => {
    if (
      !friendName.trim() ||
      !friendAge.trim() ||
      !friendLocation.trim() ||
      !friendGender.trim()
    ) {
      Alert.alert("Error", "Please fill in all friend details for demo mode");
      return;
    }

    setLoading(true);
    try {
      // Create a mock friend user for demo
      const mockFriend: User = {
        id: `demo_friend_${Date.now()}`,
        name: friendName,
        age: parseInt(friendAge),
        location: friendLocation,
        gender: friendGender,
        interests: ["Adventure Sports", "Food & Dining", "Music"], // Default interests
        profileComplete: true,
      };

      console.log("Creating demo session with mock friend:", mockFriend);
      const session = await createSwipeSession(mockFriend);
      console.log("Demo session created:", session.id);

      router.push("/swipe-demo");
    } catch (error) {
      console.error("Failed to start demo:", error);
      Alert.alert("Error", "Failed to start demo session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        <UserPlus size={64} color="#FF8C42" />

        <Text style={styles.title}>Invite a Friend</Text>
        <Text style={styles.subtitle}>
          Start planning the perfect outing together
        </Text>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Invite a Real Friend</Text>
          <Input
            label="Friend's Name"
            value={friendName}
            onChangeText={setFriendName}
            placeholder="Enter your friend's name"
          />

          <Button
            title={loading ? "Sending..." : "Send Invitation"}
            onPress={handleInvite}
            disabled={loading}
            size="large"
            style={styles.button}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR TRY DEMO MODE</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.sectionTitle}>Demo with Mock Friend</Text>
          <Input
            label="Friend's Name"
            value={friendName}
            onChangeText={setFriendName}
            placeholder="Enter demo friend's name"
          />

          <Input
            label="Age"
            value={friendAge}
            onChangeText={setFriendAge}
            placeholder="Enter age"
            keyboardType="numeric"
          />

          <Input
            label="Location"
            value={friendLocation}
            onChangeText={setFriendLocation}
            placeholder="Enter city"
          />

          <Input
            label="Gender"
            value={friendGender}
            onChangeText={setFriendGender}
            placeholder="Enter gender"
          />

          <Button
            title={loading ? "Starting Demo..." : "Start Demo Session"}
            variant="outline"
            onPress={handleStartDemo}
            disabled={loading}
            size="large"
            style={styles.button}
          />
        </View>

        <View style={styles.infoCard}>
          <Share2 size={24} color="#FF8C42" />
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            1. Send an invitation to your friend{"\n"}
            2. Both of you swipe on activity images{"\n"}
            3. AI creates a perfect outing plan for both of you
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
    marginBottom: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
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
    marginTop: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginTop: 8,
  },
});
