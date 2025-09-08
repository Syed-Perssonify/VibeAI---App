import { GeneratedImage } from "@/types/user";
import { Heart, X } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SwipeCardProps {
  image: GeneratedImage;
  onSwipe: (direction: "left" | "right") => void;
  isTop?: boolean;
}

export default function SwipeCard({
  image,
  onSwipe,
  isTop = false,
}: SwipeCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => isTop,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: (pan.x as any)._value,
        y: (pan.y as any)._value,
      });
    },
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      rotate.setValue(gestureState.dx / 10);
    },
    onPanResponderRelease: (_, gestureState) => {
      pan.flattenOffset();
      const threshold = screenWidth * 0.25;

      if (Math.abs(gestureState.dx) > threshold) {
        const direction = gestureState.dx > 0 ? "right" : "left";
        const toValue = {
          x: direction === "right" ? screenWidth * 1.5 : -screenWidth * 1.5,
          y: gestureState.dy + (direction === "right" ? -100 : 100),
        };

        Animated.parallel([
          Animated.timing(pan, {
            toValue,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          onSwipe(direction);
        });
      } else {
        // Snap back to center
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, screenWidth * 0.3],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-screenWidth * 0.3, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: isTop ? opacity : 1,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: rotateInterpolate },
          ],
        },
        !isTop && styles.cardBehind,
      ]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <Image source={{ uri: image.url }} style={styles.image} />

      {/* Like Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          styles.likeIndicator,
          { opacity: likeOpacity },
        ]}
      >
        <Heart size={32} color="#4CAF50" fill="#4CAF50" />
        <Text style={[styles.indicatorText, styles.likeText]}>LIKE</Text>
      </Animated.View>

      {/* Nope Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          styles.nopeIndicator,
          { opacity: nopeOpacity },
        ]}
      >
        <X size={32} color="#FF6B6B" />
        <Text style={[styles.indicatorText, styles.nopeText]}>NOPE</Text>
      </Animated.View>

      <View style={styles.overlay}>
        <View style={styles.gradientOverlay} />
        <View style={styles.textContent}>
          <Text style={styles.vibeType}>{image.vibeType}</Text>
          <Text style={styles.description}>{image.description}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  cardBehind: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  textContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  vibeType: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 22,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  indicator: {
    position: "absolute",
    top: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
  },
  likeIndicator: {
    right: 20,
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    transform: [{ rotate: "15deg" }],
  },
  nopeIndicator: {
    left: 20,
    borderColor: "#FF6B6B",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    transform: [{ rotate: "-15deg" }],
  },
  indicatorText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  likeText: {
    color: "#4CAF50",
  },
  nopeText: {
    color: "#FF6B6B",
  },
});
