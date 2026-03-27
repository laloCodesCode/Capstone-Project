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

  const [image, setImage] = useState<any>(null);
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

      if (image) {
        const imageFile = {
          uri: image.uri,
          name: image.filename || "item.jpg",
          type: image.mimeType || "image/jpeg",
        };

        await itemService.uploadImage(item.id, imageFile, true);
      }

      setSuccessMessage("Item posted successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setCondition("good");
      setLocation("");
      setSelectedParentId("");
      setSelectedChildId("");
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
            <Text style={postStyles.secondaryButtonText}>
              Choose From Library
            </Text>
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