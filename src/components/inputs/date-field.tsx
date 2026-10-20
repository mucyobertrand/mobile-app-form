import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text } from "react-native";

import { ui } from "@/components/ui";

export type DateFieldProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  placeholder?: string;
};

// web version is in date-field.web.tsx
export function DateField({ value, onChange, minimumDate, placeholder = "Select date" }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  if (Platform.OS === "ios") {
    return (
      <DateTimePicker
        value={value ?? new Date()}
        mode="date"
        display="compact"
        minimumDate={minimumDate}
        onValueChange={(_, date) => onChange(date)}
        style={{ alignSelf: "flex-start" }}
      />
    );
  }

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={ui.input}>
        <Text>{value ? value.toLocaleDateString() : placeholder}</Text>
      </Pressable>
      {open && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          minimumDate={minimumDate}
          onValueChange={(_, date) => {
            setOpen(false);
            onChange(date);
          }}
          onDismiss={() => setOpen(false)}
        />
      )}
    </>
  );
}
