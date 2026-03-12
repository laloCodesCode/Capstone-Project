import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { itemService } from "../services/item";
import CameraCapture from "./cameraCapture";
import { postStyles } from "../styles/post.styles";
import { colors } from "../styles/colors";

export default function PostItemForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<any>(null);
    const [openCamera, setOpenCamera] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !description || !price) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        try {
            setSuccessMessage("");
            setErrorMessage("");
            setLoading(true);

            const item = await itemService.createItem({
                title,
                description,
                price: parseFloat(price),
            });

            if (image) {
                const imageFile = {
                    uri: image.uri,
                    name: "item.jpg",
                    type: "image/jpeg",
                };

                await itemService.uploadImage(item.item_listing_id, imageFile, true);
            }

            setSuccessMessage("Item posted successfully!");
            setTitle("");
            setDescription("");
            setPrice("");
            setImage(null);

            console.log("Item created:", item);
        } catch (error: any) {
            console.error("Error creating item:", error);
            setErrorMessage(error.message || "Failed to post item");
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    if (openCamera) {
        return (
            <CameraCapture
                onPhotoTaken={(photo: any) => {
                    console.log("Photo taken:", photo);
                    setImage(photo);
                    setOpenCamera(false);
                }}
                onClose={() => setOpenCamera(false)}
            />
        );
    }

    return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={postStyles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={postStyles.card}>
              <Text style={postStyles.title}>Post an Item</Text>
              <Text style={postStyles.subtitle}>Add details for your listing</Text>
      
              {successMessage ? (
                <Text style={postStyles.successText}>{successMessage}</Text>
              ) : null}
      
              {errorMessage ? (
                <Text style={postStyles.errorText}>{errorMessage}</Text>
              ) : null}
      
              <TextInput
                placeholder="Title"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
                style={postStyles.input}
                returnKeyType="next"
              />
      
              <TextInput
                placeholder="Description"
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                style={[postStyles.input, postStyles.descriptionInput]}
                multiline
              />
      
              <TextInput
                placeholder="Price"
                placeholderTextColor={colors.textSecondary}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                style={postStyles.input}
              />
      
              {image && (
                <Image source={{ uri: image.uri }} style={postStyles.imagePreview} />
              )}
      
              <TouchableOpacity
                style={postStyles.secondaryButton}
                onPress={() => setOpenCamera(true)}
              >
                <Text style={postStyles.secondaryButtonText}>Take Photo</Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                style={postStyles.secondaryButton}
                onPress={pickImage}
              >
                <Text style={postStyles.secondaryButtonText}>Choose From Library</Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                style={postStyles.primaryButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.genralWhite} />
                ) : (
                  <Text style={postStyles.primaryButtonText}>Post Item</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
}