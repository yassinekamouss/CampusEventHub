import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { useAuth } from "../../hooks/use-auth";
import {
  EventModel as Event,
  useAdminEvents as useEvents,
} from "../../services/events";

const eventSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  location: z.string().min(2, "Le lieu est requis"),
  description: z
    .string()
    .min(10, "La description doit faire au moins 10 caractères"),
  date: z.date({
    message: "La date est requise",
  }),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const { eventsQuery, addEventMutation: createEventMutation } = useEvents();
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      date: new Date(),
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const newEvent = {
      title: data.title,
      location: data.location,
      description: data.description,
      date: data.date.toISOString(),
    };

    createEventMutation.mutate(newEvent, {
      onSuccess: () => {
        setModalVisible(false);
        reset();
      },
    });
  };

  const renderEventItem = ({ item }: { item: Event }) => {
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <Text style={styles.headerSubtitle}>Gestion des événements</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {eventsQuery.isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : eventsQuery.isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Erreur lors du chargement des événements :{" "}
            {eventsQuery.error.message}
          </Text>
        </View>
      ) : (
        <FlatList
          data={eventsQuery.data}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun événement n'a été créé.</Text>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal d'ajout d'événement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvel événement</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalDismiss}>Ignorer</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={[]}
              renderItem={() => null}
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={
                <View style={styles.formContainer}>
                  {/* Titre */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Titre de l'événement</Text>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            errors.title && styles.inputError,
                          ]}
                          placeholder="Ex: Hackathon..."
                          placeholderTextColor="#666"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    {errors.title && (
                      <Text style={styles.fieldError}>
                        {errors.title.message}
                      </Text>
                    )}
                  </View>

                  {/* Date */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Date et Heure</Text>
                    <Controller
                      control={control}
                      name="date"
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.datePickerText}>
                              {value
                                ? value.toLocaleString("fr-FR")
                                : "Sélectionnez une date"}
                            </Text>
                          </TouchableOpacity>
                          {showDatePicker && (
                            <DateTimePicker
                              value={value || new Date()}
                              mode="datetime"
                              display="default"
                              onChange={(event, selectedDate) => {
                                setShowDatePicker(Platform.OS === "ios");
                                if (selectedDate) {
                                  onChange(selectedDate);
                                }
                              }}
                            />
                          )}
                        </>
                      )}
                    />
                    {errors.date && (
                      <Text style={styles.fieldError}>
                        {errors.date.message}
                      </Text>
                    )}
                  </View>

                  {/* Lieu */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Lieu</Text>
                    <Controller
                      control={control}
                      name="location"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            errors.location && styles.inputError,
                          ]}
                          placeholder="Ex: Amphi A..."
                          placeholderTextColor="#666"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    {errors.location && (
                      <Text style={styles.fieldError}>
                        {errors.location.message}
                      </Text>
                    )}
                  </View>

                  {/* Description */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Description</Text>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            styles.inputMultiline,
                            errors.description && styles.inputError,
                          ]}
                          placeholder="Description détaillée de l'événement..."
                          placeholderTextColor="#666"
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    {errors.description && (
                      <Text style={styles.fieldError}>
                        {errors.description.message}
                      </Text>
                    )}
                  </View>

                  {/* Erreur mutation */}
                  {createEventMutation.isError && (
                    <View style={styles.mutationError}>
                      <Text style={styles.mutationErrorText}>
                        {createEventMutation.error.message}
                      </Text>
                    </View>
                  )}

                  {/* Bouton submit */}
                  <TouchableOpacity
                    style={[
                      styles.submitBtn,
                      createEventMutation.isPending && styles.submitBtnDisabled,
                    ]}
                    onPress={() => handleSubmit(onSubmit)()}
                    disabled={createEventMutation.isPending}>
                    {createEventMutation.isPending && (
                      <ActivityIndicator
                        color="#ffffff"
                        style={styles.submitLoader}
                      />
                    )}
                    <Text style={styles.submitBtnText}>
                      {createEventMutation.isPending
                        ? "Création en cours..."
                        : "Créer l'événement"}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 50 : 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  logoutText: {
    color: "#f87171",
    fontWeight: "600",
    fontSize: 13,
  },

  // List
  listContent: {
    padding: 24,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },

  // Event Card
  eventCard: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  eventTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  eventDate: {
    color: "#0066cc",
    fontWeight: "500",
    marginBottom: 4,
    fontSize: 13,
  },
  eventLocation: {
    color: "#888",
    marginBottom: 10,
    fontSize: 13,
  },
  eventDescription: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
  },

  // Centered (loading/error)
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
    fontSize: 14,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#0066cc",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0066cc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: "85%",
    borderTopWidth: 1,
    borderColor: "#333",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  modalDismiss: {
    color: "#888",
    fontWeight: "500",
    fontSize: 15,
  },

  // Form
  formContainer: {
    gap: 4,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 15,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  fieldError: {
    color: "#f87171",
    fontSize: 12,
    marginTop: 6,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  datePickerText: {
    color: "#ffffff",
    fontSize: 15,
  },
  mutationError: {
    backgroundColor: "rgba(127, 29, 29, 0.3)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(127, 29, 29, 0.5)",
  },
  mutationErrorText: {
    color: "#f87171",
    fontSize: 13,
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#0066cc",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitLoader: {
    marginRight: 8,
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
