import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { itemService } from "../../src/services/item";
import { ListingUpdate } from "../../src/types/auth";
import { ItemResponse } from "../../src/types/item";
import { myListingsStyles } from "../../src/styles/mylistings.styles";
import { colors } from "../../src/styles/colors";

export default function MyListingsScreen() {
  const [listings, setListings] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ListingUpdate>({});
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemService.getMyItems();
      setListings(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleEdit = (item: ItemResponse) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      description: item.description,
      price: item.price,
      condition: item.condition,
      location: item.location,
      status: item.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (itemId: string) => {
    try {
      setSaveLoading(true);
      await itemService.updateItem(itemId, editForm);
      setEditingId(null);
      setEditForm({});
      fetchListings();
    } catch (e: unknown) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Failed to update listing",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = (item: ItemResponse) => {
    Alert.alert("Delete Listing", `Delete "${item.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await itemService.deleteItem(item.id);
            fetchListings();
          } catch (e: unknown) {
            Alert.alert(
              "Error",
              e instanceof Error ? e.message : "Failed to delete listing",
            );
          }
        },
      },
    ]);
  };

  const updateField = (field: keyof ListingUpdate, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary01,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary02} />
      </View>
    );

  if (error)
    return (
      <View style={myListingsStyles.errorContainer}>
        <Text style={myListingsStyles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchListings}>
          <Text style={myListingsStyles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={myListingsStyles.container}>
      {/* Header */}
      <View style={myListingsStyles.header}>
        <Text style={myListingsStyles.headerTitle}>My Listings</Text>
        <Text style={myListingsStyles.headerSubtitle}>
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </Text>
      </View>

      {listings.length === 0 ? (
        <View style={myListingsStyles.emptyContainer}>
          <Text style={myListingsStyles.emptyText}>
            You have no listings yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={myListingsStyles.listContent}
          renderItem={({ item }) => {
            const isEditing = editingId === item.id;

            return (
              <View style={myListingsStyles.card}>
                {isEditing ? (
                  // Edit mode
                  <>
                    <View>
                      <Text style={myListingsStyles.inputLabel}>Title</Text>
                      <TextInput
                        style={myListingsStyles.input}
                        value={editForm.title}
                        onChangeText={(val) => updateField("title", val)}
                        placeholderTextColor="#a0aec0"
                      />
                    </View>

                    <View>
                      <Text style={myListingsStyles.inputLabel}>
                        Description
                      </Text>
                      <TextInput
                        style={[myListingsStyles.input, { height: 80 }]}
                        value={editForm.description}
                        onChangeText={(val) => updateField("description", val)}
                        multiline
                        placeholderTextColor="#a0aec0"
                      />
                    </View>

                    <View>
                      <Text style={myListingsStyles.inputLabel}>Price</Text>
                      <TextInput
                        style={myListingsStyles.input}
                        value={String(editForm.price ?? "")}
                        onChangeText={(val) => updateField("price", val)}
                        keyboardType="decimal-pad"
                        placeholderTextColor="#a0aec0"
                      />
                    </View>

                    <View>
                      <Text style={myListingsStyles.inputLabel}>Condition</Text>
                      <TextInput
                        style={myListingsStyles.input}
                        value={editForm.condition}
                        onChangeText={(val) => updateField("condition", val)}
                        placeholderTextColor="#a0aec0"
                      />
                    </View>

                    <View>
                      <Text style={myListingsStyles.inputLabel}>Location</Text>
                      <TextInput
                        style={myListingsStyles.input}
                        value={editForm.location}
                        onChangeText={(val) => updateField("location", val)}
                        placeholderTextColor="#a0aec0"
                      />
                    </View>

                    <View>
                      <Text style={myListingsStyles.inputLabel}>Status</Text>
                      <TextInput
                        style={myListingsStyles.input}
                        value={editForm.status}
                        onChangeText={(val) => updateField("status", val)}
                        placeholderTextColor="#a0aec0"
                      />
                    </View>

                    <View style={myListingsStyles.divider} />

                    <View style={myListingsStyles.actionRow}>
                      <TouchableOpacity
                        style={myListingsStyles.saveButton}
                        onPress={() => handleSave(item.id)}
                        disabled={saveLoading}
                      >
                        {saveLoading ? (
                          <ActivityIndicator
                            color={colors.genralWhite}
                            size="small"
                          />
                        ) : (
                          <Text style={myListingsStyles.saveButtonText}>
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={myListingsStyles.cancelButton}
                        onPress={handleCancelEdit}
                      >
                        <Text style={myListingsStyles.cancelButtonText}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  // View mode
                  <>
                    <View style={myListingsStyles.cardHeader}>
                      <Text style={myListingsStyles.title} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={myListingsStyles.statusBadge}>
                        <Text style={myListingsStyles.statusText}>
                          {item.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={myListingsStyles.price}>${item.price}</Text>
                    <Text style={myListingsStyles.detail}>
                      {item.condtion} · {item.location}
                    </Text>
                    <Text style={myListingsStyles.detail} numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View style={myListingsStyles.divider} />

                    <View style={myListingsStyles.actionRow}>
                      <TouchableOpacity
                        style={myListingsStyles.editButton}
                        onPress={() => handleEdit(item)}
                      >
                        <Text style={myListingsStyles.editButtonText}>
                          Edit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={myListingsStyles.deleteButton}
                        onPress={() => handleDelete(item)}
                      >
                        <Text style={myListingsStyles.deleteButtonText}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
