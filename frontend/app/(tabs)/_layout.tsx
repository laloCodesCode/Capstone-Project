//Bottom tabs entry point
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />



      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="mail-open" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          title: "User",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
