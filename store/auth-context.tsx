import { Session, User } from "@supabase/supabase-js";
import { Href, useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { supabase } from "../services/supabase";

export type UserRole = "admin" | "student";

export interface UserProfile {
  id: string;
  role: UserRole;
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

function useProtectedRoute(
  user: User | null,
  profile: UserProfile | null,
  isInitialized: boolean,
) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (user && !profile) {
      // Attendre que le profil soit chargé
      console.log("AuthContext: Waiting for profile...", { user: user.id });
      return;
    }

    console.log("AuthContext: Routing Evaluation...", {
      user: !!user,
      profile: profile?.role,
      segments,
    });

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const isRoot = segments.length === 0 || !segments[0];

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login" as Href);
    } else if (user && profile) {
      if (inAuthGroup || isRoot) {
        if (profile.role === "admin") {
          router.replace("/(admin)/dashboard" as Href);
        } else {
          router.replace("/(tabs)" as Href);
        }
      } else if (inAdminGroup && profile.role !== "admin") {
        router.replace("/(tabs)" as Href);
      }
    }
  }, [user, profile, segments, isInitialized, router]);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setIsInitialized(true);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setProfile(null);
        if (!isInitialized) setIsInitialized(true);
      } else {
        await fetchProfile(newSession.user.id);
        if (!isInitialized) setIsInitialized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Fallback/timeout to stop infinite loading/waiting if DB is slow or profile missing
      let isTimeout = false;
      const timeoutId = setTimeout(() => {
        isTimeout = true;
        console.warn("fetchProfile timeout reached. Using fallback (student).");
        setProfile({ id: userId, role: "student" });
      }, 5000);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .single();

      clearTimeout(timeoutId);
      if (isTimeout) return;

      if (error) throw error;
      if (data) {
        setProfile({ id: data.id, role: data.role as UserRole });
      } else {
        setProfile({ id: userId, role: "student" });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du profil utilisateur",
        error,
      );
      // Fallback to allow navigating somewhere instead of infinite loop
      setProfile({ id: userId, role: "student" });
    }
  };

  useProtectedRoute(user, profile, isInitialized);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    isInitialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
