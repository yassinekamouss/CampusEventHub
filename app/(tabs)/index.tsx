import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/use-auth";
import { EventModel, useAdminEvents as useEvents } from "../../services/events";

export default function FeedScreen() {
  const { signOut } = useAuth();
  const { eventsQuery } = useEvents();

  const renderEventItem = ({ item }: { item: EventModel }) => {
    const eventDate = new Date(item.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{eventDate}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Events</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Feed Content */}
      {eventsQuery.isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : eventsQuery.isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Erreur: {eventsQuery.error.message}
          </Text>
        </View>
      ) : (
        <FlatList
          data={eventsQuery.data}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucun événement à venir pour le moment.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4444",
  },
  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
  listContent: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  eventTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  eventDate: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventLocation: {
    color: "#999",
    fontSize: 13,
    marginBottom: 12,
  },
  eventDescription: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
});
