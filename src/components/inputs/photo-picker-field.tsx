import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, Platform, StyleSheet, Text, View } from "react-native";

import { CameraCapture } from "@/components/inputs/camera-capture";
import { ui } from "@/components/ui";

export type PickedPhoto = {
  uri: string;
  width: number;
  height: number;
  mimeType: string | null;
  source: "camera" | "gallery";
};

const isWeb = Platform.OS === "web";

export function PhotoPickerField({
  value,
  onChange,
}: {
  value: PickedPhoto | null;
  onChange: (photo: PickedPhoto | null) => void;
}) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  };

  const save = (result: ImagePicker.ImagePickerResult, source: PickedPhoto["source"]) => {
    if (result.canceled) return;
    const { uri, width, height, mimeType } = result.assets[0];
    onChange({ uri, width, height, mimeType: mimeType ?? null, source });
  };

  const takePhoto = async () => {
    // browsers have no camera app to open, so use the in-app camera instead
    if (isWeb) return setCameraOpen(true);
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return setError("Camera access was denied.");
    save(await ImagePicker.launchCameraAsync(options), "camera");
  };

  const chooseFromGallery = async () => {
    save(await ImagePicker.launchImageLibraryAsync(options), "gallery");
  };

  return (
    <View style={styles.container}>
      {value && <Image source={{ uri: value.uri }} style={styles.preview} />}
      <View style={styles.buttons}>
        <Button title="Take photo" onPress={takePhoto} />
        <Button title={isWeb ? "Upload photo" : "Choose from gallery"} onPress={chooseFromGallery} />
        {!isWeb && <Button title="Live camera" onPress={() => setCameraOpen(true)} />}
        {value && <Button title="Remove" onPress={() => onChange(null)} />}
      </View>
      {error && <Text style={ui.error}>{error}</Text>}

      <CameraCapture
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(photo) =>
          onChange({
            uri: photo.uri,
            width: photo.width,
            height: photo.height,
            mimeType: photo.format === "png" ? "image/png" : "image/jpeg",
            source: "camera",
          })
        }
      />
    </View>
  );
}

// leave out the uri: on web it's the whole image as base64
export const photoSummary = ({ uri, ...rest }: PickedPhoto) => rest;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  preview: {
    width: 120,
    height: 120,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
