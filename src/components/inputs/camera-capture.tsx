import { Ionicons } from "@react-native-vector-icons/ionicons";
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Image, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CameraCapture({
  visible,
  onClose,
  onCapture,
}: {
  visible: boolean;
  onClose: () => void;
  onCapture: (photo: CameraCapturedPicture) => void;
}) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>(Platform.OS === "web" ? "front" : "back");
  const [ready, setReady] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const camera = useRef<CameraView>(null);

  const close = () => {
    setPhoto(null);
    setReady(false);
    onClose();
  };

  const shoot = async () => {
    if (!ready || !camera.current) return;
    setPhoto(await camera.current.takePictureAsync({ quality: 0.8 }));
  };

  const accept = () => {
    if (photo) onCapture(photo);
    close();
  };

  let content;
  if (!permission?.granted) {
    content = (
      <View style={styles.center}>
        <Text style={styles.white}>Allow camera access to take a photo.</Text>
        {permission?.canAskAgain !== false && (
          <Button title="Allow camera" onPress={requestPermission} />
        )}
      </View>
    );
  } else if (photo) {
    content = (
      <>
        <Image source={{ uri: photo.uri }} style={styles.flex} resizeMode="contain" />
        <View style={[styles.bar, { paddingBottom: insets.bottom + 20 }]}>
          <Button title="Retake" onPress={() => setPhoto(null)} />
          <Button title="Use photo" onPress={accept} />
        </View>
      </>
    );
  } else {
    content = (
      <>
        <CameraView
          ref={camera}
          style={styles.flex}
          facing={facing}
          onCameraReady={() => setReady(true)}
        />
        <View style={[styles.bar, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            accessibilityLabel="Flip camera">
            <Ionicons name="camera-reverse-outline" size={30} color="#fff" />
          </Pressable>
          <Pressable onPress={shoot} style={styles.shutter} accessibilityLabel="Take photo" />
          <View style={{ width: 30 }} />
        </View>
      </>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <View style={styles.container}>
        {content}
        <Pressable
          onPress={close}
          style={[styles.close, { top: insets.top + 12 }]}
          accessibilityLabel="Close camera">
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  white: {
    color: "white",
    textAlign: "center",
  },
  close: {
    position: "absolute",
    left: 16,
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#ddd",
  },
});
