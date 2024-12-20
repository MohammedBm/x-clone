import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { colorStyle } from "@/constants/Colors";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60, // Set a fixed height
          paddingBottom: 5, // Add a small padding at the bottom
        },
        tabBarActiveTintColor: colorStyle.primary,
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
          tabBarLabel: "Search",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
