import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { Event } from "../types/event";

const NOTIFICATION_STORAGE_KEY_PREFIX = "event_notification_";

/**
 * Demande les permissions pour afficher les notifications à l'utilisateur.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0066cc",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

/**
 * Programme une notification de rappel 1 heure avant la date de l'événement.
 */
export async function scheduleEventReminder(event: Event): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("Permission de notification refusée.");
      return;
    }

    const eventDate = new Date(event.date);
    // 1 heure avant l'événement
    const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000);

    // Ne pas programmer si la date de rappel est dans le passé
    if (reminderDate.getTime() <= Date.now()) {
      console.log(
        "Trop tard pour programmer le rappel (événement dans moins d'une heure ou passé).",
      );
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel d'événement 📅",
        body: `📅 Rappel : ${event.title} commence bientôt à ${event.location} !`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });

    // Enregistrer l'ID de notification pour pouvoir l'annuler plus tard
    await SecureStore.setItemAsync(
      `${NOTIFICATION_STORAGE_KEY_PREFIX}${event.id}`,
      notificationId,
    );
  } catch (error) {
    console.error("Erreur lors de la programmation du rappel :", error);
  }
}

/**
 * Annule le rappel si l'étudiant se désinscrit.
 */
export async function cancelEventReminder(eventId: string): Promise<void> {
  try {
    const storageKey = `${NOTIFICATION_STORAGE_KEY_PREFIX}${eventId}`;
    const notificationId = await SecureStore.getItemAsync(storageKey);

    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await SecureStore.deleteItemAsync(storageKey);
      console.log(`Notification annulée pour l'événement ${eventId}.`);
    }
  } catch (error) {
    console.error("Erreur lors de l'annulation du rappel :", error);
  }
}
