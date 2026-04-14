import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#EEEEEE",
        tabBarInactiveTintColor: "#52525B",
        tabBarStyle: {
          backgroundColor: Platform.OS === "ios" ? "transparent" : "#000000",
          borderTopColor: "#27272A",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          position: Platform.OS === "ios" ? "absolute" : "relative",
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 11,
          letterSpacing: 0.5,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Découvrir",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: "Mon Agenda",
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
