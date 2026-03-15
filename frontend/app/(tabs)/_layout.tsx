//Bottom tabs entry point
import { Tabs } from "expo-router";
import { colors } from "../../src/styles/colors";

export default function TabsLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary01,
          borderTopColor: colors.primary01,
        },
        tabBarActiveTintColor: colors.primary02,
        tabBarInactiveTintColor: colors.registerColor,
      }}
    >





      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="post" options={{ title: "Post" }} />
      </Tabs>
    </Tabs>
  );
}
