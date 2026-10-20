import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (code: string) => void;
  length?: number;
}) {
  const refs = useRef<(TextInput | null)[]>([]);
  const focus = (i: number) => refs.current[Math.max(0, Math.min(i, length - 1))]?.focus();

  const handleChange = (text: string, i: number) => {
    const digits = text.replace(/\D/g, "");
    // more than one digit means the code was pasted or autofilled
    const next =
      digits.length > 1
        ? (value.slice(0, i) + digits).slice(0, length)
        : (value.slice(0, i) + digits + value.slice(i + 1)).slice(0, length);
    onChange(next);
    if (digits) focus(digits.length > 1 ? next.length : i + 1);
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }, (_, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={styles.box}
          value={value[i] ?? ""}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && !value[i] && i > 0) {
              onChange(value.slice(0, i - 1));
              focus(i - 1);
            }
          }}
          onFocus={() => i > value.length && focus(value.length)}
          keyboardType="number-pad"
          textContentType={i === 0 ? "oneTimeCode" : "none"}
          autoComplete={i === 0 ? "sms-otp" : "off"}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  box: {
    width: 40,
    height: 44,
    borderWidth: 1,
  },
});
