import Button from "@/components/buttom";
import { useUser } from "@/hooks/user-store";
import { router } from "expo-router";
import { Heart, Sparkles, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Sparkles size={64} color="#FF8C42" />
          <Text style={styles.title}>Welcome to Outing Planner</Text>
          <Text style={styles.subtitle}>
            Discover perfect outings with friends through AI-powered matching
          </Text>
          <Button
            title="Get Started"
            onPress={() => router.push("/onboarding")}
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user.name}! 👋</Text>
        <Text style={styles.subtitle}>Ready to plan your next adventure?</Text>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.actionCard}>
          <Users size={32} color="#FF8C42" />
          <Text style={styles.actionTitle}>Invite a Friend</Text>
          <Text style={styles.actionDescription}>
            Start a new outing planning session with a friend
          </Text>
          <Button
            title="Invite Friend"
            onPress={() => router.push("/invite")}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.actionCard}>
          <Heart size={32} color="#FF8C42" />
          <Text style={styles.actionTitle}>Active Sessions</Text>
          <Text style={styles.actionDescription}>
            Continue planning with friends
          </Text>
          <Button
            title="View Sessions"
            variant="outline"
            onPress={() => router.push("/sessions")}
            style={styles.actionButton}
          />
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Age: {user.age}</Text>
          <Text style={styles.profileText}>Location: {user.location}</Text>
          <Text style={styles.profileText}>
            Interests: {user.interests.join(", ")}
          </Text>
        </View>
        <Button
          title="Edit Profile"
          variant="secondary"
          onPress={() => router.push("/profile")}
          style={styles.profileButton}
        />
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
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    marginTop: 32,
    minWidth: 200,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionCard: {
    backgroundColor: "#FFF5F0",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    minWidth: 140,
  },
  profileSection: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  profileInfo: {
    marginBottom: 16,
  },
  profileText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  profileButton: {
    alignSelf: "flex-start",
  },
});
