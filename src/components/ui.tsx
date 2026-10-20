import { ReactNode } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={ui.field}>
      <Text>{label}</Text>
      {children}
      {error && <Text style={ui.error}>{error}</Text>}
    </View>
  );
}

export function Input({ style, ...props }: TextInputProps) {
  return <TextInput {...props} style={[ui.input, style]} />;
}

export const ui = StyleSheet.create({
  field: {
    gap: 4,
    marginBottom: 16,
  },
  error: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
