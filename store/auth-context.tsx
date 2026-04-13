import { Session, User } from "@supabase/supabase-js";
import { Href, useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { supabase } from "../services/supabase";

// Définition des rôles
export type UserRole = "admin" | "student";

// Typage strict du profil utilisateur
export interface UserProfile {
  id: string;
  role: UserRole;
  // D'autres champs peuvent être ajoutés ici (nom, prenom, etc.)
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isInitialized: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Logique pour protéger les routes automatiquement
function useProtectedRoute(
  user: User | null,
  profile: UserProfile | null,
  isInitialized: boolean,
) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Ne rien faire tant que l'état d'authentification n'est pas initialement chargé
    if (!isInitialized) return;

    // Vérifier si l'utilisateur se trouve dans le groupe de routes d'authentification ou admin
    const inAuthGroup = (segments[0] as string) === "(auth)";
    const inAdminGroup = (segments[0] as string) === "(admin)";

    if (!user && !inAuthGroup) {
      // Utilisateur non connecté essayant d'accéder à une route protégée
      router.replace("/(auth)/login" as Href);
    } else if (user && profile) {
      // Une fois le profil chargé, on gère les redirections par rôle
      if (inAuthGroup) {
        // Redirection depuis le login/signup
        if (profile.role === "admin") {
          router.replace("/(admin)/dashboard" as Href);
        } else {
          router.replace("/(tabs)/index" as Href);
        }
      } else if (inAdminGroup && profile.role !== "admin") {
        // Protection de la route admin pour les étudiants
        router.replace("/(tabs)/index" as Href);
      }
    }
  }, [user, profile, segments, isInitialized, router]);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 1. Initialiser la session depuis le stockage de l'appareil
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setIsInitialized(true);
    };

    fetchSession();

    // 2. Écouter les changements d'état (login, logout, token refresh...)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Reset le profil si déconnexion
      if (!newSession?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Récupérer le profil et le rôle Supabase quand l'utilisateur change
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data) setProfile(data as UserProfile);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du profil utilisateur",
          error,
        );
      }
    };

    fetchProfile();
  }, [user]);

  // Exécution de la protection de route à chaque changement d'état
  useProtectedRoute(user, profile, isInitialized);

  // Méthode utilitaire de déconnexion
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    isInitialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
