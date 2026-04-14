import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/use-auth";
import { eventService } from "../../services/event-service";
import { Event } from "../../types/event";

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

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventData();
  }, [id, userId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(id!);
      setEvent(data);

      if (userId) {
        const registered = await eventService.checkRegistration(id!, userId);
        setIsRegistered(registered);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load event.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!userId) return;
    try {
      setRegistering(true);
      await eventService.registerForEvent(id!, userId);
      setIsRegistered(true);
      queryClient.invalidateQueries({ queryKey: ["userRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["totalRegistrations"] });
    } catch (err: any) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!userId) return;
    try {
      setRegistering(true);
      await eventService.unregisterFromEvent(id!, userId);
      setIsRegistered(false);
      queryClient.invalidateQueries({ queryKey: ["userRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["totalRegistrations"] });
    } catch (err: any) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e60000" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Event not found"}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryStr = event.category || "default";
  const imageUrl = CATEGORY_IMAGES[categoryStr] || CATEGORY_IMAGES.default;

  const eventDate = new Date(event.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.heroImage} />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryStr.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.metaRow}>
            <Feather name="calendar" size={18} color="#888" />
            <Text style={styles.metaText}>{eventDate}</Text>
          </View>

          <View style={styles.metaRow}>
            <Feather name="map-pin" size={18} color="#888" />
            <Text style={styles.metaText}>{event.location}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>À propos de l'événement</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Action footer */}
      <View style={styles.footer}>
        {isRegistered ? (
          <TouchableOpacity
            style={[styles.dangerBtn, registering && styles.disabledBtn]}
            onPress={handleUnregister}
            disabled={registering}>
            {registering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnContentRow}>
                <Feather name="x-circle" size={20} color="#fff" />
                <Text style={styles.dangerBtnText}> Se désinscrire</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryBtn, registering && styles.disabledBtn]}
            onPress={handleRegister}
            disabled={registering}>
            {registering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Confirmer ma présence</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    marginBottom: 20,
  },
  backBtn: {
    padding: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    width: "100%",
    height: 320,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#e60000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaText: {
    fontSize: 15,
    color: "#aaa",
    marginLeft: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#2a2a2a",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#eee",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#aaa",
    lineHeight: 26,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "rgba(18,18,18,0.9)",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  primaryBtn: {
    backgroundColor: "#e60000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerBtn: {
    backgroundColor: "rgba(255, 68, 68, 0.9)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  btnContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});
