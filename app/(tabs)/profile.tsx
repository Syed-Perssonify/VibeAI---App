import Button from "@/components/buttom";
import { useUser } from "@/hooks/user-store";
import { Calendar, Heart, MapPin, User } from "lucide-react-native";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>No Profile Found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={48} color="#FF8C42" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Calendar size={20} color="#FF8C42" />
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>{user.age}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={20} color="#FF8C42" />
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{user.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <User size={20} color="#FF8C42" />
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{user.gender}</Text>
        </View>
      </View>

      <View style={styles.interestsCard}>
        <View style={styles.cardHeader}>
          <Heart size={20} color="#FF8C42" />
          <Text style={styles.cardTitle}>Interests</Text>
        </View>
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />

        <Button
          title="Logout"
          variant="secondary"
          onPress={handleLogout}
          style={styles.button}
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
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF5F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  infoCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  interestsCard: {
    backgroundColor: "#FFF5F0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    backgroundColor: "#FF8C42",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  interestText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});
