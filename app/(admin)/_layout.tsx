import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../hooks/use-auth";

export default function AdminLayout() {
  const { user, profile, isInitialized } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(
      "AdminLayout - User:",
      !!user,
      "| Role:",
      profile?.role,
      "| Loading:",
      loading,
    );

    // Custom timeout fallback for role loading
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 3000);

    if (profile?.role) {
      setLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [user, profile, loading]);

  if (!isInitialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Checking admin permissions...</Text>
      </View>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Access Denied. Admins only.</Text>
      </View>
    );
  }

  return (
    <Stack initialRouteName="dashboard">
      <Stack.Screen
        name="dashboard"
        options={{ title: "Admin Dashboard", headerShown: false }}
      />
    </Stack>
  );
}
