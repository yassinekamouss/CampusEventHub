import { useState } from "react";
import { supabase } from "../services/supabase";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // La redirection est gérée automatiquement par notre AuthContext via onAuthStateChange
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
