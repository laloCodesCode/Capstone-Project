import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "../styles/colors";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState } from "react";
import { Image } from "expo-image";
import { MeResponse } from "../types/auth";
import { itemService } from "../services/item";
import { favoriteService } from "../services/favorite";
import { useFocusEffect, useRouter } from "expo-router";
type ProfileTopTabsProps = {
  profile: MeResponse | null;
  logout: () => Promise<void>;
};

type ListingImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

type ListingItem = {
  id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  images?: ListingImage[];
};

type FavoriteItem = {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
  title: string;
  price: number;
  location: string;
  status: string;
  listing_image_url?: string | null;
};

const Tab = createMaterialTopTabNavigator();

function ListingsScreen() {

  const router = useRouter();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  

  const loadListings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await itemService.getMyItems();
      setListings(data);
      setHasLoaded(true);
    } catch (err) {
      console.log("ERROR LOADING MY LISTINGS:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded) {
        loadListings();
      }
    }, [hasLoaded, loadListings])
  );

  const onRefresh = useCallback(async () => {
    await loadListings(true);
  }, [loadListings]);

  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary02} />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary01,
        padding: 12,
      }}
    >
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => {
          const primaryImage =
            item.images?.find((img) => img.is_primary) || item.images?.[0];

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/item/${item.id}`)}
              style={{
                width: "48%",
                backgroundColor: colors.primary02,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <Image
                source={
                  primaryImage
                    ? `${process.env.EXPO_PUBLIC_API_URL}/listing-image/${primaryImage.id}/download`
                    : "https://via.placeholder.com/300x200.png?text=No+Image"
                }
                style={{ width: "100%", height: 120 }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />

              <View style={{ padding: 10 }}>
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text style={{ color: "black", marginTop: 4 }}>
                  ${item.price}
                </Text>

                <Text style={{ color: "black", marginTop: 2 }} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: "#ccc", textAlign: "center", marginTop: 30 }}>
            No listings yet.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await favoriteService.getFavorites();
      setFavorites(data);
      setHasLoaded(true);
    } catch (err) {
      console.log("ERROR LOADING FAVORITES:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded) {
        loadFavorites();
      }
    }, [hasLoaded, loadFavorites])
  );

  const onRefresh = useCallback(async () => {
    await loadFavorites(true);
  }, [loadFavorites]);

  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary02} />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary01,
        padding: 12,
      }}
    >
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(`/item/${item.listing_id}`)}
            style={{
              width: "48%",
              backgroundColor: colors.primary02,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              source={
                item.listing_image_url ||
                "https://via.placeholder.com/300x200.png?text=No+Image"
              }
              style={{ width: "100%", height: 120 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />

            <View style={{ padding: 10 }}>
              <Text
                style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Text style={{ color: "black", marginTop: 4 }}>${item.price}</Text>

              <Text style={{ color: "black", marginTop: 2 }} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#ccc", textAlign: "center", marginTop: 30 }}>
            No favorites yet.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function SettingsScreen({
  profile,
  logout,
}: {
  profile: MeResponse | null;
  logout: () => Promise<void>;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary01,
        padding: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 16, marginBottom: 10 }}>
        Username
      </Text>
      <Text style={{ color: "#ccc", marginBottom: 20 }}>
        @{profile?.username}
      </Text>

      <Text style={{ color: "white", fontSize: 16, marginBottom: 10 }}>
        School Email
      </Text>
      <Text style={{ color: "#ccc", marginBottom: 30 }}>
        {profile?.school_email}
      </Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: "red",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ProfileTopTabs({
  profile,
  logout,
}: ProfileTopTabsProps) {
  return (
    <Tab.Navigator
      id="ProfileTopTabs"
      screenOptions={{
        tabBarScrollEnabled: true,
        lazy: true,
        lazyPreloadDistance: 0,
        tabBarStyle: {
          backgroundColor: colors.primary01,
        },
        tabBarLabelStyle: {
          color: colors.genralWhite,
          fontWeight: "600",
          textTransform: "none",
        },
        tabBarItemStyle: {
          width: "auto",
          paddingHorizontal: 24,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary02,
        },
        sceneStyle: {
          backgroundColor: colors.primary01,
          overflow: "hidden",
        },
      }}
    >
      <Tab.Screen name="Listings" component={ListingsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings">
        {() => <SettingsScreen profile={profile} logout={logout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
