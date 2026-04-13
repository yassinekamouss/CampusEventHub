import { useState } from "react";
import { supabase } from "../services/supabase";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }
      return { success: true };
    } catch (err: any) {
      setError(
        err.message || "Erreur lors de l'inscription. Veuillez réessayer.",
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
