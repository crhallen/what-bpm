import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const INITIAL_TAPS_REQUIRED = 2;
const LOOKBACK_LENGTH = 30;
const MAX_TAP_GAP = 2; // 2 seconds

const calculateBpm = (taps: number[]) => {
  if (taps.length < 2) {
    return 0;
  }

  const lookback = taps.slice(-LOOKBACK_LENGTH);
  const delta = lookback.at(-1)! - lookback[0];
  const exactBpm = ((lookback.length - 1) / delta) * 60;
  return Math.round(exactBpm * 10) / 10;
};

// add animations for tap expiry
// app icon
// add auto-detect bpm

export default function App() {
  const [taps, setTaps] = useState<number[]>([]);

  const countTap = () => {
    const newTapTimestamp = Date.now() / 1000;
    const hasTapWindowExpired = newTapTimestamp - taps.at(-1)! > MAX_TAP_GAP;

    if (taps.length === 0 || hasTapWindowExpired) {
      setTaps([newTapTimestamp]);
    } else {
      setTaps([...taps, newTapTimestamp]);
    }
  };

  const [tapLocation, setTapLocation] = useState({ x: 0, y: 0 });
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  const doAnimation = (e: GestureResponderEvent) => {
    scaleAnimation.setValue(1);
    opacityAnimation.setValue(1);
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    setTapLocation({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Pressable
        onPressIn={(e) => {
          countTap();
          doAnimation(e);
        }}
        style={({ pressed }) => [
          {
            // backgroundColor: pressed ? "#333333" : "#000000",
            backgroundColor: "#000000",
          },
          styles.tapPanel,
        ]}
      >
        {({ pressed }) =>
          taps.length < INITIAL_TAPS_REQUIRED ? (
            <Text style={styles.bpmText}>--</Text>
          ) : (
            <Text style={styles.bpmText}>{calculateBpm(taps).toFixed(1)}</Text>
          )
        }
      </Pressable>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            transform: [
              { translateX: tapLocation.x },
              { translateY: tapLocation.y },
              { scale: scaleAnimation },
            ],
            opacity: opacityAnimation,
          },
          styles.animatedCircle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedCircle: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    // backgroundColor:
    //   "radial-gradient(transparent 45%, rgba(255, 255, 255, 0.15) 70%, transparent 70%)",
  },
  tapPanel: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bpmText: {
    fontSize: 80,
    textAlign: "center",
    color: "#fafafa",
    pointerEvents: "none",
  },
});
