import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Heart, MapPin, Sparkles, Users } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const INTRO_STEPS = [
  {
    icon: Heart,
    title: "Welcome to VibeSync",
    description:
      "The ultimate app for planning perfect outings with friends. Discover activities that match both your personalities!",
    color: "#FF8C42",
  },
  {
    icon: Users,
    title: "Create Your Profile",
    description:
      "Tell us about yourself - your age, location, interests, and preferences to get personalized recommendations",
    color: "#FF8C42",
  },
  {
    icon: MapPin,
    title: "AI-Generated Activities",
    description:
      "Our AI creates unique activity images based on your profile, showing places perfect for your age and vibe",
    color: "#FF8C42",
  },
  {
    icon: Sparkles,
    title: "Swipe & Match",
    description:
      "Play a Tinder-style game with your friend. Swipe right on activities you love, left on ones you don't",
    color: "#FF8C42",
  },
  {
    icon: Heart,
    title: "Perfect Itineraries",
    description:
      "Based on your swipes, we assess your personalities and create the perfect outing plan for both of you",
    color: "#FF8C42",
  },
];

export default function IntroScreen() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const animateStep = useCallback(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: (currentStep + 1) / INTRO_STEPS.length,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentStep, fadeAnim, slideAnim, scaleAnim, progressAnim]);

  useEffect(() => {
    animateStep();
  }, [animateStep]);

  const handleNext = async () => {
    if (currentStep < INTRO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await markIntroAsSeen();
      router.replace("/onboarding");
    }
  };

  const handleSkip = async () => {
    await markIntroAsSeen();
    router.replace("/onboarding");
  };

  const markIntroAsSeen = async () => {
    try {
      await AsyncStorage.setItem("hasSeenIntro", "true");
    } catch (error) {
      console.log("Error saving intro status:", error);
    }
  };

  const currentStepData = INTRO_STEPS[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Background Gradient Effect */}
      <View
        style={[
          styles.backgroundGradient,
          { backgroundColor: currentStepData.color + "10" },
        ]}
      />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: currentStepData.color + "20" },
            ]}
          >
            <IconComponent
              size={60}
              color={currentStepData.color}
              strokeWidth={1.5}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Step Indicators */}
        <View style={styles.stepIndicators}>
          {INTRO_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    index === currentStep ? "#FF8C42" : "#E0E0E0",
                  transform: [{ scale: index === currentStep ? 1.2 : 1 }],
                },
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: "#FF8C42" }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === INTRO_STEPS.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
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
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 40,
    marginTop: 80,
    marginBottom: 40,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF8C42",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 280,
  },
  bottomSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    gap: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
  },
  buttonContainer: {
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#FF8C42",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: "center",
    shadowColor: "#FF8C42",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
