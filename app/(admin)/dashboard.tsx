import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/use-auth";
import { eventService } from "../../services/event-service";
import { Event } from "../../types/event";

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["eventStats"],
    queryFn: () => eventService.getEventStats(),
  });

  const { data: totalRegistrations } = useQuery({
    queryKey: ["totalRegistrations"],
    queryFn: () => eventService.getTotalRegistrations(),
  });

  const { data: recentEvents, isLoading } = useQuery({
    queryKey: ["recentEvents"],
    queryFn: () => eventService.getRecentEvents(10),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventStats"] });
    },
  });

  const confirmDelete = (id: string) => {
    Alert.alert("Confirmer", "Voulez-vous vraiment supprimer cet événement ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.overviewSection}>
      <Text style={styles.sectionTitle}>Aperçu</Text>
      <View style={styles.cardsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Événements actifs</Text>
          <Text style={styles.statValue}>{recentEvents?.length ?? 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Événements</Text>
          <Text style={styles.statValue}>{stats?.totalEvents ?? 0}</Text>
        </View>
        <View style={[styles.statCard, styles.statCardFull]}>
          <Text style={styles.statTitle}>Total Inscriptions</Text>
          <Text style={styles.statValue}>{totalRegistrations ?? 0}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.mainActionBtn}
        onPress={() => router.push("/(admin)/create-event" as any)}>
        <Feather
          name="plus"
          size={24}
          color="#ffffff"
          style={styles.mainActionIcon}
        />
        <Text style={styles.mainActionText}>
          Programmer un nouvel événement
        </Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
        Événements récents
      </Text>
    </View>
  );

  const renderEventItem = ({ item }: { item: Event }) => {
    const formattedDate = new Date(item.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.eventRow}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>{formattedDate}</Text>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id)}>
          <Feather name="trash-2" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Admin</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Feather name="log-out" size={20} color="#aaaaaa" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentEvents || []}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
  },
  scrollContent: {
    padding: 20,
  },
  overviewSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888888",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  statCardFull: {
    width: "100%",
    marginTop: 12,
  },
  statTitle: {
    fontSize: 13,
    color: "#aaaaaa",
    marginBottom: 12,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  mainActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066cc",
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
  },
  mainActionIcon: {
    marginRight: 10,
  },
  mainActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    color: "#aaaaaa",
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#333333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: "#dddddd",
    fontSize: 11,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#2a1e1e",
    borderRadius: 8,
  },
});
