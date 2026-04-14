import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/use-auth";
import { eventService } from "../../services/event-service";

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => eventService.getUserStats(user!.id),
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se déconnecter.");
    }
  };

  const username = user?.email?.split('@')[0] || "Utilisateur";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={40} color="#aaaaaa" />
        </View>
        <Text style={styles.userName}>{username}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <View style={[styles.roleBadge, profile?.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeStudent]}>
          <Text style={styles.roleText}>{profile?.role === 'admin' ? 'Administrateur' : 'Étudiant'}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Mes Statistiques</Text>
        
        {isLoading ? (
          <ActivityIndicator size="small" color="#0066cc" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Feather name="bookmark" size={24} color="#aaaaaa" style={styles.statIcon} />
              <Text style={styles.statValue}>{stats?.joined || 0}</Text>
              <Text style={styles.statLabel}>Événements rejoints</Text>
            </View>
            
            <View style={styles.statBox}>
              <Feather name="plus-circle" size={24} color="#aaaaaa" style={styles.statIcon} />
              <Text style={styles.statValue}>{stats?.created || 0}</Text>
              <Text style={styles.statLabel}>Événements créés</Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitleContainer: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 30,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  userEmail: {
    fontSize: 14,
    color: "#aaaaaa",
    marginBottom: 16,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  roleBadgeStudent: {
    backgroundColor: "rgba(170, 170, 170, 0.1)",
    borderColor: "#555555",
  },
  roleBadgeAdmin: {
    backgroundColor: "rgba(0, 102, 204, 0.1)",
    borderColor: "#0066cc",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888888",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#aaaaaa",
    textAlign: "center",
    lineHeight: 18,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "rgba(255, 68, 68, 0.3)",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
