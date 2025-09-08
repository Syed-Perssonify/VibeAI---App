import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@/hooks/user-store";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { INDIAN_STATES } from "@/constants/vibes";
import { ChevronDown } from "lucide-react-native";

const INTERESTS = [
  "Adventure Sports",
  "Art & Culture",
  "Food & Dining",
  "Nightlife",
  "Shopping",
  "Wellness",
  "Music",
  "Nature",
  "Technology",
  "Fitness",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const AGE_OPTIONS = Array.from({ length: 34 }, (_, i) => (17 + i).toString()); // 17-50

export default function OnboardingScreen() {
  const { createUser } = useUser();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    age: "",
    location: "",
    gender: "",
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const validatePhoneNumber = (phone: string) => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    return indianPhoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    // Validation with red star indicators
    if (!formData.firstName.trim()) {
      Alert.alert("Error", "First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      Alert.alert("Error", "Last name is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert("Error", "Phone number is required");
      return;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert(
        "Error",
        "Please enter a valid Indian phone number (10 digits starting with 6-9)"
      );
      return;
    }
    if (!formData.age) {
      Alert.alert("Error", "Age is required");
      return;
    }
    if (!formData.location) {
      Alert.alert("Error", "Location is required");
      return;
    }
    if (!formData.gender) {
      Alert.alert("Error", "Gender is required");
      return;
    }
    if (selectedInterests.length === 0) {
      Alert.alert("Error", "Please select at least one interest");
      return;
    }

    setLoading(true);
    try {
      await createUser({
        name: `${formData.firstName} ${formData.lastName}`,
        age: parseInt(formData.age),
        location: formData.location,
        gender: formData.gender,
        interests: selectedInterests,
      });
      router.replace("/home");
    } catch {
      Alert.alert("Error", "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const DropdownField = ({
    label,
    value,
    options,
    onSelect,
    showDropdown,
    setShowDropdown,
    placeholder,
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    placeholder: string;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color="#666" />
      </TouchableOpacity>
      {showDropdown && (
        <ScrollView style={styles.dropdownList} nestedScrollEnabled>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>
          Help us understand your preferences to find perfect outings
        </Text>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text style={styles.label}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <Input
                value={formData.firstName}
                onChangeText={(firstName) =>
                  setFormData((prev) => ({ ...prev, firstName }))
                }
                placeholder="First name"
                style={styles.input}
              />
            </View>
            <View style={styles.nameField}>
              <Text style={styles.label}>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
              <Input
                value={formData.lastName}
                onChangeText={(lastName) =>
                  setFormData((prev) => ({ ...prev, lastName }))
                }
                placeholder="Last name"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <Input
              value={formData.phoneNumber}
              onChangeText={(phoneNumber) =>
                setFormData((prev) => ({ ...prev, phoneNumber }))
              }
              placeholder="Enter 10-digit mobile number"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
            />
          </View>

          <DropdownField
            label="Age"
            value={formData.age}
            options={AGE_OPTIONS}
            onSelect={(age) => setFormData((prev) => ({ ...prev, age }))}
            showDropdown={showAgeDropdown}
            setShowDropdown={setShowAgeDropdown}
            placeholder="Select your age"
          />

          <DropdownField
            label="Location"
            value={formData.location}
            options={INDIAN_STATES}
            onSelect={(location) =>
              setFormData((prev) => ({ ...prev, location }))
            }
            showDropdown={showLocationDropdown}
            setShowDropdown={setShowLocationDropdown}
            placeholder="Select your location"
          />

          <DropdownField
            label="Gender"
            value={formData.gender}
            options={GENDER_OPTIONS}
            onSelect={(gender) => setFormData((prev) => ({ ...prev, gender }))}
            showDropdown={showGenderDropdown}
            setShowDropdown={setShowGenderDropdown}
            placeholder="Select your gender"
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Select Your Interests <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.interestsContainer}>
              {INTERESTS.map((interest) => (
                <Button
                  key={interest}
                  title={interest}
                  variant={
                    selectedInterests.includes(interest) ? "primary" : "outline"
                  }
                  size="small"
                  onPress={() => handleInterestToggle(interest)}
                  style={styles.interestButton}
                />
              ))}
            </View>
          </View>

          <Button
            title={loading ? "Creating Profile..." : "Complete Profile"}
            onPress={handleSubmit}
            disabled={loading}
            size="large"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
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
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  nameField: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF0000",
    fontSize: 16,
  },
  input: {
    marginBottom: 0,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestButton: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 32,
  },
});
