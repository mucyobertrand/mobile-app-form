import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInputProps, View } from "react-native";

import { Input } from "@/components/ui";

export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Input
        {...props}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      <Pressable
        onPress={() => setVisible(!visible)}
        style={styles.toggle}
        hitSlop={8}
        accessibilityLabel={visible ? "Hide password" : "Show password"}>
        <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
  },
  input: {
    paddingRight: 36,
  },
  toggle: {
    position: "absolute",
    right: 8,
  },
});
