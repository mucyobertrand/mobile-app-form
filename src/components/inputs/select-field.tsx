import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { ui } from "@/components/ui";

export function SelectField({
  value,
  options,
  onChange,
  placeholder = "Select",
}: {
  value: string | null;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={[ui.input, styles.trigger]}>
        <Text>{value ?? placeholder}</Text>
        <Ionicons name="chevron-down" size={16} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  style={[ui.row, styles.option]}>
                  <Text>{item}</Text>
                  {item === value && <Ionicons name="checkmark" size={16} />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: "white",
  },
  option: {
    padding: 12,
  },
});
