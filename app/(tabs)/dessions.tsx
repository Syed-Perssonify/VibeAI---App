import Button from "@/components/buttom";
import { useUser } from "@/hooks/user-store";
import { SwipeSession, User } from "@/types/user";
import { router } from "expo-router";
import {
  CheckCircle,
  Clock,
  Plus,
  User as UserIcon,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionsScreen() {
  const { user, sessions, setCurrentSession, demoFriends, createSwipeSession } =
    useUser();
  const insets = useSafeAreaInsets();
  const [creatingSession, setCreatingSession] = useState(false);

  const activeSessions = sessions.filter((s) => s.status === "active");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const handleSessionPress = (session: SwipeSession) => {
    setCurrentSession(session);
    if (session.status === "active") {
      router.push("/swipe-demo");
    } else if (session.status === "completed" && session.itinerary) {
      router.push({
        pathname: "/itinerary",
        params: {
          itinerary: session.itinerary,
          userPersonality:
            session.personalityAssessments?.[user?.id || ""]?.name,
          friendPersonality:
            session.personalityAssessments?.[
              session.users.find((id) => id !== user?.id) || ""
            ]?.name,
        },
      });
    }
  };

  const handleCreateSessionWithFriend = async (friend: User) => {
    if (!user) return;

    setCreatingSession(true);
    try {
      console.log("Creating session with demo friend:", friend.name);
      const session = await createSwipeSession(friend);
      console.log("Session created successfully:", session.id);

      Alert.alert(
        "Session Created!",
        `Your session with ${friend.name} is ready. Start swiping to discover your perfect outing!`,
        [
          {
            text: "Start Swiping",
            onPress: () => {
              setCurrentSession(session);
              router.push("/swipe-demo");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to create session:", error);
      Alert.alert("Error", "Failed to create session. Please try again.");
    } finally {
      setCreatingSession(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const SessionCard = ({ session }: { session: SwipeSession }) => {
    const friendName =
      session.userNames.find((name) => name !== user?.name) || "Unknown";
    const isActive = session.status === "active";

    return (
      <TouchableOpacity
        style={[styles.sessionCard, isActive && styles.activeSessionCard]}
        onPress={() => handleSessionPress(session)}
      >
        <View style={styles.sessionHeader}>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Session with {friendName}</Text>
            <Text style={styles.sessionDate}>
              {formatDate(session.createdAt)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.activeBadge : styles.completedBadge,
            ]}
          >
            {isActive ? (
              <Clock size={16} color="#FF8C42" />
            ) : (
              <CheckCircle size={16} color="#4CAF50" />
            )}
            <Text
              style={[
                styles.statusText,
                isActive ? styles.activeText : styles.completedText,
              ]}
            >
              {isActive ? "Active" : "Completed"}
            </Text>
          </View>
        </View>

        <Text style={styles.sessionDescription}>
          {isActive
            ? `${session.images.length} activities to explore together`
            : "Itinerary ready to view"}
        </Text>

        {session.personalityAssessments && (
          <View style={styles.personalityPreview}>
            <Text style={styles.personalityPreviewText}>
              Personalities:{" "}
              {Object.values(session.personalityAssessments)
                .map((p) => p.name)
                .join(" & ")}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Sessions</Text>
        <Text style={styles.subtitle}>
          Manage your outing planning sessions
        </Text>
      </View>

      {activeSessions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {activeSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </View>
      )}

      {completedSessions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Sessions</Text>
          {completedSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </View>
      )}

      {/* Demo Friends Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Start Session with Demo Friends</Text>
        <Text style={styles.sectionSubtitle}>
          Try the app with our demo friends to see how it works!
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.friendsScroll}
        >
          {demoFriends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={styles.friendCard}
              onPress={() => handleCreateSessionWithFriend(friend)}
              disabled={creatingSession}
            >
              <View style={styles.friendAvatar}>
                <UserIcon size={24} color="#FF8C42" />
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendLocation}>{friend.location}</Text>
              <Text style={styles.friendAge}>Age {friend.age}</Text>
              <View style={styles.friendInterests}>
                {friend.interests.slice(0, 2).map((interest, index) => (
                  <Text key={index} style={styles.friendInterest}>
                    {interest}
                  </Text>
                ))}
              </View>
              <View style={styles.startSessionButton}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.startSessionText}>Start Session</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Users size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyDescription}>
            Start by creating a session with one of our demo friends above!
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Invite Real Friend"
          onPress={() => router.push("/invite")}
          size="large"
          variant="outline"
          style={styles.newSessionButton}
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeSessionCard: {
    backgroundColor: "#FFF5F0",
    borderColor: "#FF8C42",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  activeBadge: {
    backgroundColor: "#FFF5F0",
  },
  completedBadge: {
    backgroundColor: "#F0F8F0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  activeText: {
    color: "#FF8C42",
  },
  completedText: {
    color: "#4CAF50",
  },
  sessionDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  personalityPreview: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 8,
  },
  personalityPreviewText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  inviteButton: {
    minWidth: 160,
  },
  actions: {
    marginTop: 20,
  },
  newSessionButton: {
    marginBottom: 20,
  },
  friendsScroll: {
    marginTop: 12,
  },
  friendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 180,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF5F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  friendLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  friendAge: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  friendInterests: {
    alignItems: "center",
    marginBottom: 12,
  },
  friendInterest: {
    fontSize: 11,
    color: "#FF8C42",
    backgroundColor: "#FFF5F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 2,
    textAlign: "center",
  },
  startSessionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF8C42",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  startSessionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});
