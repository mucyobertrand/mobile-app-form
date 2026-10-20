import { Pressable, StyleSheet, Text, View } from "react-native";

import { ui } from "@/components/ui";

export type ColorOption = { name: string; hex: string };

export function ColorPicker({
  options,
  value,
  onChange,
}: {
  options: ColorOption[];
  value: string | null;
  onChange: (name: string) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={ui.row}>
        {options.map((color) => (
          <Pressable
            key={color.name}
            onPress={() => onChange(color.name)}
            style={[styles.ring, color.name === value && styles.ringSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected: color.name === value }}
            accessibilityLabel={color.name}>
            <View style={[styles.swatch, { backgroundColor: color.hex }]} />
          </Pressable>
        ))}
      </View>
      <Text>{value ?? "No colour selected"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  ring: {
    padding: 2,
    borderWidth: 2,
    borderRadius: "50%",
    borderColor: "transparent",
  },
  ringSelected: {
    borderColor: "black",
  },
  swatch: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: "50%",
  },
});
