import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import { Input, ui } from "@/components/ui";

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={ui.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}>
      <Ionicons name={checked ? "checkbox-outline" : "square-outline"} size={20} />
      <Text style={styles.flex}>{label}</Text>
    </Pressable>
  );
}

export function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <View style={styles.list}>
      {options.map((option) => (
        <Checkbox
          key={option}
          label={option}
          checked={value.includes(option)}
          onChange={(checked) =>
            onChange(checked ? [...value, option] : value.filter((v) => v !== option))
          }
        />
      ))}
    </View>
  );
}

function RadioOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={ui.row}
      accessibilityRole="radio"
      accessibilityState={{ selected }}>
      <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={20} />
      <Text>{label}</Text>
    </Pressable>
  );
}

export function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.list}>
      {options.map((option) => (
        <RadioOption
          key={option}
          label={option}
          selected={option === value}
          onPress={() => onChange(option)}
        />
      ))}
    </View>
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={[ui.row, styles.wrap]}>
      {options.map((option) => (
        <RadioOption
          key={option}
          label={option}
          selected={option === value}
          onPress={() => onChange(option)}
        />
      ))}
    </View>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <View style={ui.row}>
      <Button
        title="−"
        onPress={() => onChange(Math.max(min, value - 1))}
        accessibilityLabel="Decrease"
      />
      <Text>{value}</Text>
      <Button
        title="+"
        onPress={() => onChange(Math.min(max, value + 1))}
        accessibilityLabel="Increase"
      />
    </View>
  );
}

export function Rating({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}) {
  return (
    <View style={ui.row}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} accessibilityLabel={`${star} of ${max}`}>
          <Ionicons name={star <= value ? "star" : "star-outline"} size={24} />
        </Pressable>
      ))}
    </View>
  );
}

export function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };

  return (
    <View style={styles.list}>
      <Input
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={add}
        submitBehavior="submit"
        returnKeyType="done"
        placeholder={placeholder}
      />
      {value.length > 0 && (
        <View style={[ui.row, styles.wrap]}>
          {value.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => onChange(value.filter((t) => t !== tag))}
              style={styles.tag}
              accessibilityLabel={`Remove ${tag}`}>
              <Text>{tag}</Text>
              <Ionicons name="close" size={14} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    gap: 8,
  },
  wrap: {
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
  },
});
