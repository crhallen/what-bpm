import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const LOOKBACK_LENGTH = 10;
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

// add animations for tapping and for tap expiry
// add auto-detect bpm

export default function App() {
  const [taps, setTaps] = useState<number[]>([]);

  const handleTap = () => {
    const nowInSeconds = Date.now() / 1000;
    const hasTapWindowExpired = nowInSeconds - taps.at(-1)! > MAX_TAP_GAP;

    if (taps.length === 0 || hasTapWindowExpired) {
      setTaps([nowInSeconds]);
    } else {
      setTaps([...taps, nowInSeconds]);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleTap}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#333333" : "#000000",
          },
          styles.tapPanel,
        ]}
      >
        {({ pressed }) => (
          <Text style={styles.bpmText}>{calculateBpm(taps).toFixed(1)}</Text>
        )}
      </Pressable>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});
