import { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { itemService } from "../services/item";
import CameraCapture from "./cameraCapture";
import { postStyles } from "../styles/post.styles";
import { colors } from "../styles/colors";
import { CategoryResponse } from "../types/category";
import { categoryService } from "../services/category";

export default function PostItemForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");

  const [images, setImages] = useState<any[]>([]);
  const [openCamera, setOpenCamera] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoryService.getAllCategories();
        console.log("CATEGORIES FROM API:", data);
        setCategories(data);
      } catch (error: any) {
        console.error("Error loading categories:", error);
        setErrorMessage(error.message || "Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const parentCategories = categories.filter(
    (category) => category.parent_id === null
  );

  const childCategories = categories.filter(
    (category) => category.parent_id === selectedParentId
  );

  const handleParentChange = (value: string) => {
    setSelectedParentId(value);
    setSelectedChildId("");
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !location) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!selectedParentId || !selectedChildId) {
      setErrorMessage("Please select a category and subcategory");
      return;
    }

    const parsedPrice = parseFloat(price);

    if (isNaN(parsedPrice)) {
      setErrorMessage("Please enter a valid price");
      return;
    }

    try {
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(true);

      const itemPayload = {
        title,
        description,
        price: parsedPrice,
        condition,
        location,
        category_id: selectedChildId,
      };

      const item = await itemService.createItem(itemPayload);

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const currentImage = images[i];
      
          const imageFile = {
            uri: currentImage.uri,
            name: currentImage.fileName || currentImage.filename || `item-${i}.jpg`,
            type: currentImage.mimeType || "image/jpeg",
          };
      
          await itemService.uploadImage(item.id, imageFile, i === 0);
        }
      }

      setSuccessMessage("Item posted successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setCondition("good");
      setLocation("");
      setSelectedParentId("");
      setSelectedChildId("");
      setImages([]);

      console.log("Item created:", item);
    } catch (error: any) {
      console.error("Error creating item:", error);
      setErrorMessage(error.message || "Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 8) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  if (openCamera) {
    return (
      <CameraCapture
        onPhotoTaken={(photo: any) => {
          console.log("Photo taken:", photo);
          setImages((prev) => (prev.length < 8 ? [...prev, photo] : prev));
          setOpenCamera(false);
        }}
        onClose={() => setOpenCamera(false)}
      />
    );
  }

  console.log("parentCategories:", parentCategories);
  console.log("CATEGORIES FROM API:", categories);

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

          <Text style={postStyles.label}>Add photos ({images.length}/8)</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={postStyles.photoRow}
          >
            {Array.from({ length: 8 }).map((_, index) => {
              const photo = images[index];

              return (
                <TouchableOpacity
                  key={index}
                  style={postStyles.photoBox}
                  onPress={() => {
                    if (!photo) pickImage();
                  }}
                  activeOpacity={0.8}
                >
                  {photo ? (
                    <View style={{ width: "100%", height: "100%" }}>
                      <Image
                        source={{ uri: photo.uri }}
                        style={postStyles.photoBoxImage}
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        style={postStyles.removeImageButton}
                      >
                        <Text style={postStyles.removeImageButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={postStyles.plus}>+</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

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
            <Text style={postStyles.secondaryButtonText}>
              Choose From Library
            </Text>
          </TouchableOpacity>

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

          <Text style={postStyles.label}>Condition</Text>
          <View style={postStyles.pickerWrapper}>
            <Picker
              selectedValue={condition}
              onValueChange={(itemValue) => setCondition(itemValue)}
              style={postStyles.picker}
              dropdownIconColor={colors.genralWhite}
              mode="dropdown"
            >
              <Picker.Item label="Pristine" value="pristine" />
              <Picker.Item label="Good" value="good" />
              <Picker.Item label="Worn" value="worn" />
            </Picker>
          </View>

          <TextInput
            placeholder="Location"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
            style={postStyles.input}
          />

          <Text style={postStyles.label}>Category</Text>
          <View style={postStyles.pickerWrapper}>
            {categoriesLoading ? (
              <ActivityIndicator style={{ padding: 12 }} />
            ) : (
              <Picker
                selectedValue={selectedParentId}
                onValueChange={(value) => handleParentChange(value)}
                style={postStyles.picker}
              >
                <Picker.Item label="Select a category" value="" />
                {parentCategories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            )}
          </View>

          <Text style={postStyles.label}>Subcategory</Text>
          <View style={postStyles.pickerWrapper}>
            <Picker
              selectedValue={selectedChildId}
              onValueChange={(value) => setSelectedChildId(value)}
              enabled={!!selectedParentId}
              style={postStyles.picker}
            >
              <Picker.Item label="Select a subcategory" value="" />
              {childCategories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>

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