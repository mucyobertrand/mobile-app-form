import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as DocumentPicker from "expo-document-picker";
import { Button, Pressable, Text, View } from "react-native";

import { ui } from "@/components/ui";

export type PickedFile = DocumentPicker.DocumentPickerAsset;

export function FilePickerField({
  file,
  onChange,
  type = "*/*",
  label = "Choose file",
}: {
  file: PickedFile | null;
  onChange: (file: PickedFile | null) => void;
  type?: string | string[];
  label?: string;
}) {
  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type, base64: false });
    if (!result.canceled) onChange(result.assets[0]);
  };

  if (file) {
    return (
      <View style={[ui.input, ui.row]}>
        <Ionicons name="document-outline" size={18} />
        <Text style={{ flex: 1 }} numberOfLines={1}>
          {file.name}
        </Text>
        <Pressable onPress={() => onChange(null)} hitSlop={8} accessibilityLabel="Remove file">
          <Ionicons name="close" size={18} />
        </Pressable>
      </View>
    );
  }

  return <Button title={label} onPress={pick} />;
}

export const fileSummary = (file: PickedFile) => ({
  name: file.name,
  size: file.size ?? null,
  mimeType: file.mimeType ?? null,
});
