import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { useAuth } from "../../hooks/use-auth";
import { eventService } from "../../services/event-service";

const CATEGORIES = ["Sport", "Tech", "Culture", "Workshop"] as const;

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
      "Must be YYYY-MM-DD HH:mm format",
    ),
  location: z.string().min(1, "Location is required"),
  category: z.enum(["Sport", "Tech", "Culture", "Workshop"]).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      category: "Tech",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data: EventFormData) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to create an event");
      return;
    }

    try {
      setIsSubmitting(true);
      await eventService.createEvent({
        ...data,
        created_by: user.id,
      });
      queryClient.invalidateQueries({ queryKey: ["recentEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventStats"] });
      Alert.alert("Success", "Event created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(admin)/dashboard"),
        },
      ]);
    } catch (error) {
      const e = error as Error;
      Alert.alert("Error", e.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Create Event</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="e.g. Hackathon 2026"
              placeholderTextColor="#888"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              placeholder="Describe the event..."
              placeholderTextColor="#888"
              multiline
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date & Time</Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              placeholder="YYYY-MM-DD HH:mm"
              placeholderTextColor="#888"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.date && (
          <Text style={styles.errorText}>{errors.date.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="e.g. Innovation Center, Room B"
              placeholderTextColor="#888"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.location && (
          <Text style={styles.errorText}>{errors.location.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
              onPress={() =>
                setValue("category", cat, { shouldValidate: true })
              }>
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === cat && styles.categoryButtonTextActive,
                ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}
      </View>

      <Pressable
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#121212" />
        ) : (
          <Text style={styles.submitButtonText}>Create Event</Text>
        )}
      </Pressable>
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
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  categoryButtonActive: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  categoryButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: "#121212",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
