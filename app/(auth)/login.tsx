import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { useLogin } from "../../hooks/use-login";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login, isLoading, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.brandSubtitle}>// SYSTEM_ACCESS</Text>
        <Text style={styles.title}>Campus Event Hub</Text>
        <Text style={styles.subtitle}>Veuillez vous authentifier.</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IDENTIFIANT (EMAIL)</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Entrez votre email"
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
          <Text style={styles.label}>MOT DE PASSE</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Entrez votre mot de passe"
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
            {isLoading ? "CONNEXION EN COURS..." : "ACCÉDER AU PORTAIL"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pas de profil actif ? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Initialiser un compte</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  header: {
    marginBottom: 48,
  },
  brandSubtitle: {
    color: "#0066cc",
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: "#EAEAEA",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: "#777777",
    fontSize: 15,
    fontWeight: "400",
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#8A8A8A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  input: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    color: "#EAEAEA",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 4,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#D32F2F",
    backgroundColor: "rgba(211, 47, 47, 0.05)",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
  globalErrorContainer: {
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#D32F2F",
    marginTop: 8,
    marginBottom: 12,
  },
  globalErrorText: {
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    backgroundColor: "#0066cc",
    paddingVertical: 18,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#003366",
    opacity: 0.7,
  },
  spinner: {
    marginRight: 10,
  },
  buttonText: {
    color: "#ffffff",
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
    color: "#666666",
    fontSize: 14,
  },
  linkText: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "700",
  },
});
