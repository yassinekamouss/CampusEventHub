import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/use-auth";
import { EventModel, useAdminEvents as useEvents } from "../../services/events";

// Category images mapping
const CATEGORY_IMAGES: Record<string, string> = {
  Conference:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
  Workshop:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60",
  Social:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60",
  academic:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60",
};

export default function FeedScreen() {
  const { signOut } = useAuth();
  const { eventsQuery } = useEvents();
  const router = useRouter();

  const renderEventItem = ({ item }: { item: EventModel }) => {
    const eventDate = new Date(item.date).toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const categoryStr = (item as any).category || "default";
    const imageUrl = CATEGORY_IMAGES[categoryStr] || CATEGORY_IMAGES.default;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={0.8}
        onPress={() => router.push(`/event/${item.id}`)}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{categoryStr.toUpperCase()}</Text>
            </View>
            <Text style={styles.eventDate}>{eventDate}</Text>
          </View>

          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.eventLocation} numberOfLines={1}>
            {item.location}
          </Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Découvrir</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Feed Content */}
      {eventsQuery.isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#e60000" />
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
    backgroundColor: "#121212", // dark theme bg
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoutBtn: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  logoutText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#e60000",
  },
  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  eventCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#222",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#e60000", // Thinkpad red accent
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  eventDate: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  eventTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 26,
  },
  eventLocation: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
  },
  eventDescription: {
    color: "#777",
    fontSize: 14,
    lineHeight: 22,
  },
});
