// import { useEffect, useState } from "react"; import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, } from "react-native"; import { adminService } from "../../src/services/admin"; import { AdminUser, ListingResponse, ReviewResponse, } from "../../src/types/auth"; import { adminStyles } from "../../src/styles/admin.styles"; import { colors } from "../../src/styles/colors"; type Tab = "users" | "listings" | "rewviews";

// export default function AdminScreen() {
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await adminService.getUsers();
//       setUsers(data);
//     } catch (e: unknown) {
//       setError(e instanceof Error ? e.message : "Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleMakeAdmin = (user: AdminUser) => {
//     Alert.alert("Make Admin", `Make ${user.username} an admin?`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Confirm",
//         onPress: async () => {
//           try {
//             await adminService.makeAdmin(user.id);
//             fetchUsers();
//           } catch (e: unknown) {
//             Alert.alert("Error", e instanceof Error ? e.message : "Failed");
//           }
//         },
//       },
//     ]);
//   };

//   const handleBan = (user: AdminUser) => {
//     Alert.alert(
//       user.is_banned ? "Unban User" : "Ban User",
//       `${user.is_banned ? "Unban" : "Ban"} ${user.username}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Confirm",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               if (user.is_banned) {
//                 await adminService.unbanUser(user.id);
//               } else {
//                 await adminService.banUser(user.id);
//               }
//               fetchUsers();
//             } catch (e: unknown) {
//               Alert.alert("Error", e instanceof Error ? e.message : "Failed");
//             }
//           },
//         },
//       ],
//     );
//   };

//   if (loading)
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: colors.primary01,
//         }}
//       >
//         <ActivityIndicator size="large" color={colors.primary02} />
//       </View>
//     );

//   if (error)
//     return (
//       <View style={adminStyles.errorContainer}>
//         <Text style={adminStyles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={fetchUsers}>
//           <Text style={adminStyles.retryText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );

//   return (
//     <View style={adminStyles.container}>
//       {/* Header */}
//       <View style={adminStyles.header}>
//         <Text style={adminStyles.headerTitle}>Admin Panel</Text>
//         <Text style={adminStyles.headerSubtitle}>
//           {users.length} users registered
//         </Text>
//       </View>

//       <FlatList
//         data={users}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={adminStyles.listContent}
//         renderItem={({ item }) => (
//           <View style={adminStyles.card}>
//             {/* Top row — username + badges */}
//             <View style={adminStyles.cardHeader}>
//               <Text style={adminStyles.username}>@{item.username}</Text>
//               <View style={adminStyles.badgeRow}>
//                 {item.is_admin && (
//                   <View style={[adminStyles.badge, adminStyles.badgeAdmin]}>
//                     <Text style={adminStyles.badgeText}>ADMIN</Text>
//                   </View>
//                 )}
//                 {item.is_banned && (
//                   <View style={[adminStyles.badge, adminStyles.badgeBanned]}>
//                     <Text style={adminStyles.badgeTextLight}>BANNED</Text>
//                   </View>
//                 )}
//                 {!item.is_email_verified && (
//                   <View
//                     style={[adminStyles.badge, adminStyles.badgeUnverified]}
//                   >
//                     <Text style={adminStyles.badgeTextLight}>UNVERIFIED</Text>
//                   </View>
//                 )}
//               </View>
//             </View>

//             <Text style={adminStyles.email}>{item.school_email}</Text>

//             <View style={adminStyles.divider} />

//             {/* Action buttons */}
//             <View style={adminStyles.actionRow}>
//               {!item.is_admin && (
//                 <TouchableOpacity
//                   style={adminStyles.makeAdminButton}
//                   onPress={() => handleMakeAdmin(item)}
//                 >
//                   <Text style={adminStyles.makeAdminButtonText}>
//                     Make Admin
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 style={[
//                   adminStyles.banButton,
//                   {
//                     backgroundColor: item.is_banned
//                       ? colors.success
//                       : colors.danger,
//                   },
//                 ]}
//                 onPress={() => handleBan(item)}
//               >
//                 <Text style={adminStyles.banButtonText}>
//                   {item.is_banned ? "Unban" : "Ban"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { adminService } from "../../src/services/admin";
import {
  AdminUser,
  ListingResponse,
  ReviewResponse,
} from "../../src/types/auth";
import { adminStyles } from "../../src/styles/admin.styles";
import { colors } from "../../src/styles/colors";

type Tab = "users" | "listings" | "reviews";

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("users");

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Listings state
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (e: unknown) {
      setUsersError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      setListingsLoading(true);
      setListingsError(null);
      const data = await adminService.getListings();
      setListings(data);
    } catch (e: unknown) {
      setListingsError(
        e instanceof Error ? e.message : "Failed to load listings",
      );
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchReviewsForAllUsers = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      // fetch reviews for each user
      const allReviews: ReviewResponse[] = [];
      for (const user of users) {
        const userReviews = await adminService.getReviewsForUser(user.id);
        allReviews.push(...userReviews);
      }
      setReviews(allReviews);
    } catch (e: unknown) {
      setReviewsError(
        e instanceof Error ? e.message : "Failed to load reviews",
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchListings();
  }, []);

  useEffect(() => {
    if (activeTab === "reviews" && users.length > 0 && reviews.length === 0) {
      fetchReviewsForAllUsers();
    }
  }, [activeTab, users]);

  const handleMakeAdmin = (user: AdminUser) => {
    Alert.alert("Make Admin", `Make ${user.username} an admin?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await adminService.makeAdmin(user.id);
            fetchUsers();
          } catch (e: unknown) {
            Alert.alert("Error", e instanceof Error ? e.message : "Failed");
          }
        },
      },
    ]);
  };

  const handleBan = (user: AdminUser) => {
    Alert.alert(
      user.is_banned ? "Unban User" : "Ban User",
      `${user.is_banned ? "Unban" : "Ban"} ${user.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            try {
              if (user.is_banned) {
                await adminService.unbanUser(user.id);
              } else {
                await adminService.banUser(user.id);
              }
              fetchUsers();
            } catch (e: unknown) {
              Alert.alert("Error", e instanceof Error ? e.message : "Failed");
            }
          },
        },
      ],
    );
  };

  const handleDeleteListing = (listing: ListingResponse) => {
    Alert.alert("Delete Listing", `Delete "${listing.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminService.deleteListing(listing.id);
            fetchListings();
          } catch (e: unknown) {
            Alert.alert("Error", e instanceof Error ? e.message : "Failed");
          }
        },
      },
    ]);
  };

  const handleDeleteReview = (review: ReviewResponse) => {
    Alert.alert("Delete Review", "Delete this review?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminService.deleteReview(review.id);
            setReviews((prev) => prev.filter((r) => r.id !== review.id));
          } catch (e: unknown) {
            Alert.alert("Error", e instanceof Error ? e.message : "Failed");
          }
        },
      },
    ]);
  };

  const renderUsers = () => {
    if (usersLoading)
      return (
        <ActivityIndicator color={colors.primary02} style={{ marginTop: 40 }} />
      );
    if (usersError)
      return (
        <View style={{ alignItems: "center", marginTop: 40, gap: 8 }}>
          <Text style={adminStyles.errorText}>{usersError}</Text>
          <TouchableOpacity onPress={fetchUsers}>
            <Text style={adminStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={adminStyles.listContent}
        renderItem={({ item }) => (
          <View style={adminStyles.card}>
            <View style={adminStyles.cardHeader}>
              <Text style={adminStyles.username}>@{item.username}</Text>
              <View style={adminStyles.badgeRow}>
                {item.is_admin && (
                  <View style={[adminStyles.badge, adminStyles.badgeAdmin]}>
                    <Text style={adminStyles.badgeText}>ADMIN</Text>
                  </View>
                )}
                {item.is_banned && (
                  <View style={[adminStyles.badge, adminStyles.badgeBanned]}>
                    <Text style={adminStyles.badgeTextLight}>BANNED</Text>
                  </View>
                )}
                {!item.is_email_verified && (
                  <View
                    style={[adminStyles.badge, adminStyles.badgeUnverified]}
                  >
                    <Text style={adminStyles.badgeTextLight}>UNVERIFIED</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={adminStyles.email}>{item.school_email}</Text>
            <View style={adminStyles.divider} />
            <View style={adminStyles.actionRow}>
              {!item.is_admin && (
                <TouchableOpacity
                  style={adminStyles.makeAdminButton}
                  onPress={() => handleMakeAdmin(item)}
                >
                  <Text style={adminStyles.makeAdminButtonText}>
                    Make Admin
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  adminStyles.banButton,
                  {
                    backgroundColor: item.is_banned
                      ? colors.success
                      : colors.danger,
                  },
                ]}
                onPress={() => handleBan(item)}
              >
                <Text style={adminStyles.banButtonText}>
                  {item.is_banned ? "Unban" : "Ban"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  };

  const renderListings = () => {
    if (listingsLoading)
      return (
        <ActivityIndicator color={colors.primary02} style={{ marginTop: 40 }} />
      );
    if (listingsError)
      return (
        <View style={{ alignItems: "center", marginTop: 40, gap: 8 }}>
          <Text style={adminStyles.errorText}>{listingsError}</Text>
          <TouchableOpacity onPress={fetchListings}>
            <Text style={adminStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    return (
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={adminStyles.listContent}
        renderItem={({ item }) => (
          <View style={adminStyles.card}>
            <View style={adminStyles.cardHeader}>
              <Text style={adminStyles.username}>{item.title}</Text>
              <View style={[adminStyles.badge, { backgroundColor: "#2d4f8a" }]}>
                <Text style={adminStyles.badgeTextLight}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={adminStyles.email}>
              ${item.price} · {item.condition} · {item.location}
            </Text>
            <View style={adminStyles.divider} />
            <View style={adminStyles.actionRow}>
              <TouchableOpacity
                style={[
                  adminStyles.banButton,
                  { backgroundColor: colors.danger },
                ]}
                onPress={() => handleDeleteListing(item)}
              >
                <Text style={adminStyles.banButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  };

  const renderReviews = () => {
    if (reviewsLoading)
      return (
        <ActivityIndicator color={colors.primary02} style={{ marginTop: 40 }} />
      );
    if (reviewsError)
      return (
        <View style={{ alignItems: "center", marginTop: 40, gap: 8 }}>
          <Text style={adminStyles.errorText}>{reviewsError}</Text>
          <TouchableOpacity onPress={fetchReviewsForAllUsers}>
            <Text style={adminStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    if (reviews.length === 0)
      return (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#a0aec0" }}>No reviews found</Text>
        </View>
      );
    return (
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={adminStyles.listContent}
        renderItem={({ item }) => (
          <View style={adminStyles.card}>
            <View style={adminStyles.cardHeader}>
              <Text style={adminStyles.username}>
                {"⭐".repeat(item.rating)}
              </Text>
              <Text style={adminStyles.email}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            {item.comment && (
              <Text style={{ color: "#a0aec0", fontSize: 13 }}>
                {item.comment}
              </Text>
            )}
            <View style={adminStyles.divider} />
            <View style={adminStyles.actionRow}>
              <TouchableOpacity
                style={[
                  adminStyles.banButton,
                  { backgroundColor: colors.danger },
                ]}
                onPress={() => handleDeleteReview(item)}
              >
                <Text style={adminStyles.banButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={adminStyles.container}>
      {/* Header */}
      <View style={adminStyles.header}>
        <Text style={adminStyles.headerTitle}>Admin Panel</Text>
        <Text style={adminStyles.headerSubtitle}>
          {users.length} users registered
        </Text>
      </View>

      {/* Tab switcher */}
      <View style={{ flexDirection: "row", backgroundColor: "#1a3158" }}>
        {(["users", "listings", "reviews"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === tab ? colors.primary02 : "transparent",
            }}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={{
                color: activeTab === tab ? colors.primary02 : "#a0aec0",
                fontWeight: activeTab === tab ? "700" : "400",
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === "users" && renderUsers()}
      {activeTab === "listings" && renderListings()}
      {activeTab === "reviews" && renderReviews()}
    </View>
  );
}
