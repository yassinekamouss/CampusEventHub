import { Colors } from "@/constants/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { useRegister } from "../../hooks/use-register";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Le nom complet est requis"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const result = await register(data.email, data.password, data.fullName);
    if (result && result.success) {
      Alert.alert("Succès", "Compte créé !");
      router.replace("/(auth)/login");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>
              ← RETOUR A L'IDENTIFICATION
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nouveau Profil</Text>
          <Text style={styles.subtitle}>
            Enregistrement au réseau Campus Event Hub.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOM COMPLET</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  placeholder="Jean Dupont"
                  placeholderTextColor="#555555"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                  selectionColor="#0066cc"
                />
              )}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>IDENTIFIANT (EMAIL)</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="jean.dupont@campus.edu"
                  placeholderTextColor="#555555"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                  selectionColor="#0066cc"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CLÉ DE SÉCURITÉ</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Min. 8 caractères, 1 Majuscule, 1 Chiffre"
                  placeholderTextColor="#555555"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                  selectionColor="#0066cc"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONFIRMATION</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Répétez la clé de sécurité"
                  placeholderTextColor="#555555"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                  selectionColor="#0066cc"
                />
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {error ? (
            <View style={styles.globalErrorContainer}>
              <Text style={styles.globalErrorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.85}>
            {isLoading && (
              <ActivityIndicator color="#ffffff" style={styles.spinner} />
            )}
            <Text style={styles.buttonText}>
              {isLoading ? "TRAITEMENT..." : "VALIDER LE PROFIL"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà enregistré ? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Accès système</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  backButtonText: {
    color: Colors.dark.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  title: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.dark.textMuted,
    fontSize: 15,
    fontWeight: "400",
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  input: {
    width: "100%",
    backgroundColor: Colors.dark.inputBackground,
    color: Colors.dark.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 4,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.dark.danger,
    backgroundColor: Colors.dark.dangerSoft,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
  globalErrorContainer: {
    backgroundColor: Colors.dark.dangerSoft,
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.danger,
    marginTop: 8,
    marginBottom: 12,
  },
  globalErrorText: {
    color: Colors.dark.danger,
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    backgroundColor: Colors.dark.primary,
    paddingVertical: 18,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: Colors.dark.primarySoft,
    opacity: 0.7,
  },
  spinner: {
    marginRight: 10,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 48,
  },
  footerText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
  },
  linkText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
