import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from "react-native";
import ItemListingCard from "../../src/components/itemListingCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { itemService } from "../../src/services/item";
import { ItemResponse } from "../../src/types/item";
import { categoryService } from "../../src/services/category";
import { CategoryResponse } from "../../src/types/category";
import { colors } from "../../src/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async (q = "", categoryId = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await itemService.getAllItems({
        q,
        category_id: categoryId || undefined,
      });


      setItems(data);
    } catch (err: any) {
      setError(err.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };




  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
    }
  };


  useEffect(() => {
    loadCategories();
    loadItems();
  }, []);

  const childCategories = categories.filter(
    (category) => category.parent_id !== null
  );

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  const handleSearchSubmit = () => {
    loadItems(searchText, selectedCategoryId);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setDropdownVisible(false);
    loadItems(searchText, categoryId);
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId("");
    setDropdownVisible(false);
    loadItems(searchText, "");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary01 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <TextInput
            placeholder="Search items..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            style={styles.searchInput}
            returnKeyType="search"
          />
  
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedCategory ? selectedCategory.name : "All Categories"}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
        </View>
  
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemListingCard item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary02}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No items listed yet.</Text>
          }
        />
  
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <Pressable style={styles.dropdownMenu} onPress={() => {}}>
              <ScrollView showsVerticalScrollIndicator>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={clearCategoryFilter}
                >
                  <Text style={styles.dropdownItemText}>All Categories</Text>
                </TouchableOpacity>
  
                {childCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.dropdownItem}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <Text style={styles.dropdownItemText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f2044",
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#0f2044",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.primary01,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: "#ffb71d",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: colors.primary01,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#ffb71d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  dropdownArrow: {
    fontSize: 14,
    color: colors.primary01,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    paddingTop: 160,
    paddingHorizontal: 16,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    justifyContent: "space-between",
  },
});