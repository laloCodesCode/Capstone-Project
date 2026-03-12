import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPhotoTaken: (photo: any) => void;
  onClose: () => void;
};

export default function CameraCapture({ onPhotoTaken, onClose }: Props) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      console.log("Capture tapped");
      console.log("cameraRef.current:", cameraRef.current);
      console.log("isReady:", isReady);

      if (!cameraRef.current || !isReady) return;

      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo result:", photo);
      onPhotoTaken(photo);
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => {
          console.log("Camera ready");
          setIsReady(true);
        }}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.text}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFacing((current) => (current === "back" ? "front" : "back"))
          }
        >
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto}>
          <Text style={styles.text}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});