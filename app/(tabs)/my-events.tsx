import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/use-auth";
import { eventService } from "../../services/event-service";
import { Event } from "../../types/event";

export default function MyEventsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRegistrations", user?.id],
    queryFn: () => eventService.getUserRegistrations(user!.id),
    enabled: !!user?.id,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Event }) => {
    const formattedDate = new Date(item.date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const formattedTime = new Date(item.date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push(`/event/${item.id}` as any)}>
        <View style={styles.cardIndicator} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Feather name="calendar" size={14} color="#00aa66" />
              <Text style={styles.detailText}>{formattedDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="clock" size={14} color="#00aa66" />
              <Text style={styles.detailText}>{formattedTime}</Text>
            </View>
            {item.location && (
              <View style={styles.detailItem}>
                <Feather name="map-pin" size={14} color="#00aa66" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#555" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Agenda</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00aa66" />
        </View>
      ) : events?.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="calendar" size={48} color="#333" />
          <Text style={styles.emptyText}>Aucun événement à venir.</Text>
          <Text style={styles.emptySubtext}>
            Trouvez des événements sur l'App!
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00aa66"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    backgroundColor: "#121212",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardIndicator: {
    width: 4,
    height: "100%",
    backgroundColor: "#00aa66",
    borderRadius: 4,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    color: "#aaa",
    fontSize: 13,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
  },
});
