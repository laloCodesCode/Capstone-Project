import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "../styles/colors";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { itemService } from "../services/item";
import { favoriteService } from "../services/favorite";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MeResponse } from "../types/auth";

type ProfileTopTabsProps = {
  profile: MeResponse | null;
  logout: () => Promise<void>;
};

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 2;

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const Tab = createMaterialTopTabNavigator();

function MyListingsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      setToken(savedToken);
    };

    loadToken();
  }, []);

  const loadListings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await itemService.getMyItems();
      setItems(data);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary02} />;
  }

  return (
    <FlatList
      data={items}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      contentContainerStyle={{
        paddingTop: 12,
        paddingBottom: 100,
        backgroundColor: colors.primary01,
      }}
      style={{ backgroundColor: colors.primary01 }}
      refreshing={refreshing}
      onRefresh={() => loadListings(true)}
      renderItem={({ item }) => {
        
        const image = item.images?.[0];

        const imageUrl = image?.id
          ? `${BASE_URL}/listing-image/${image.id}/download?id=${image.id}`
          : image?.image_url ?? null;

        return (
          <TouchableOpacity
            style={{ width: CARD_SIZE, marginBottom: 16 }}
            onPress={() =>
              router.push({
                pathname: "/item/[id]",
                params: { id: String(item.id) },
              })
            }
          >
            {imageUrl ? (
              <Image
                source={
                  token
                    ? {
                        uri: imageUrl,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    : { uri: imageUrl }
                }
                style={{
                  width: "100%",
                  height: CARD_SIZE,
                  borderRadius: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: CARD_SIZE,
                  borderRadius: 12,
                  backgroundColor: "#2a2a2a",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>No Image</Text>
              </View>
            )}

            <Text
              style={{
                color: "white",
                fontWeight: "600",
                marginTop: 6,
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: colors.primary02,
                fontWeight: "700",
              }}
            >
              ${item.price}
            </Text>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          No listings yet
        </Text>
      }
    />
  );
}

function SoldScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary01,
        padding: 20,
      }}
    >
      <Text style={{ color: "white" }}>Sold items coming soon</Text>
    </View>
  );
}
function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      setToken(savedToken);
    };

    loadToken();
  }, []);

  const loadFavorites = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await favoriteService.getFavorites();
      console.log("FAVORITES DATA:", JSON.stringify(data, null, 2));

      data.forEach((favorite: any, index: number) => {
        const listing = favorite.listing ?? favorite;
        const listingId =
          favorite?.listing_id ?? listing?.id ?? listing?.listing_id ?? null;
        const image =
          listing?.primaryImage ??
          listing?.primary_image ??
          favorite?.primaryImage ??
          favorite?.primary_image ??
          listing?.images?.find((img: any) => img.is_primary) ??
          listing?.images?.[0] ??
          favorite?.images?.find((img: any) => img.is_primary) ??
          favorite?.images?.[0] ??
          null;

        const resolvedImageUrl =
          favorite?.listing_image_url ??
          image?.image_url ??
          listing?.image_url ??
          favorite?.image_url ??
          (image?.id
            ? `${BASE_URL}/listing-image/${image.id}/download?id=${image.id}`
            : null);

        console.log(`FAVORITE ${index}:`, {
          rawFavorite: favorite,
          resolvedListingId: listingId,
          resolvedTitle: listing?.title ?? favorite?.title ?? "Untitled item",
          resolvedImageUrl,
          hasImagesArray: Boolean(listing?.images?.length || favorite?.images?.length),
        });
      });

      setFavorites(data);
    } catch (err) {
      console.log("FAVORITES ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (loading) {
    return (
      <ActivityIndicator
        testID="favorites-loading"
        style={{ marginTop: 20 }}
        color={colors.primary02}
      />
    );
  }

  return (
    <FlatList
      data={favorites}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      contentContainerStyle={{
        paddingTop: 12,
        paddingBottom: 100,
        backgroundColor: colors.primary01,
      }}
      style={{ backgroundColor: colors.primary01 }}
      testID="favorites-list"
      refreshing={refreshing}
      onRefresh={() => loadFavorites(true)}
      renderItem={({ item }) => {
        const listing = item.listing ?? item;
        const listingId = item?.listing_id ?? listing?.id ?? listing?.listing_id;
        const title = listing?.title ?? item?.title ?? "Untitled item";
        const price = listing?.price ?? item?.price ?? "";
        const image =
          listing?.primaryImage ??
          listing?.primary_image ??
          item?.primaryImage ??
          item?.primary_image ??
          listing?.images?.find((img: any) => img.is_primary) ??
          listing?.images?.[0] ??
          item?.images?.find((img: any) => img.is_primary) ??
          item?.images?.[0] ??
          null;

        const imageUrl =
          item?.listing_image_url ??
          image?.image_url ??
          listing?.image_url ??
          item?.image_url ??
          (image?.id
            ? `${BASE_URL}/listing-image/${image.id}/download?id=${image.id}`
            : null);

        return (
          <TouchableOpacity
            testID={`favorite-card-${listingId ?? item.id}`}
            style={{ width: CARD_SIZE, marginBottom: 16 }}
            onPress={() => {
              if (!listingId) {
                console.log("Missing listing id:", item);
                console.log("Resolved listing:", listing);
                return;
              }

              router.push({
                pathname: "/item/[id]",
                params: { id: String(listingId) },
              });
            }}
          >
            {imageUrl ? (
              <Image
                source={
                  item?.listing_image_url
                    ? token
                      ? {
                          uri: imageUrl,
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      : { uri: imageUrl }
                    : token && imageUrl?.includes("/listing-image/")
                      ? {
                          uri: imageUrl,
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      : { uri: imageUrl }
                }
                style={{
                  width: "100%",
                  height: CARD_SIZE,
                  borderRadius: 12,
                }}
              />
            ) : (
              <View
                testID={`favorite-no-image-${listingId ?? item.id}`}
                style={{
                  width: "100%",
                  height: CARD_SIZE,
                  borderRadius: 12,
                  backgroundColor: "#2a2a2a",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  No Image
                </Text>
                <Text
                  style={{
                    color: "#bbb",
                    textAlign: "center",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {imageUrl ? "Image failed to render" : "Missing image URL"}
                </Text>
              </View>
            )}

            <Text
              testID={`favorite-title-${listingId ?? item.id}`}
              style={{
                color: "white",
                fontWeight: "600",
                marginTop: 6,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>

            <Text
              testID={`favorite-price-${listingId ?? item.id}`}
              style={{
                color: colors.primary02,
                fontWeight: "700",
              }}
            >
              ${price}
            </Text>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <View testID="favorites-empty" style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ color: "white", textAlign: "center" }}>
            No favorites yet
          </Text>
          <Text
            style={{
              color: "#bbb",
              textAlign: "center",
              marginTop: 6,
              fontSize: 12,
            }}
          >
            Pull down to refresh. Check the console logs for resolved listing IDs and image URLs.
          </Text>
        </View>
      }
    />
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
        },
      }}
    >
      <Tab.Screen name="Listings" component={MyListingsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings">
        {() => <SettingsScreen profile={profile} logout={logout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
