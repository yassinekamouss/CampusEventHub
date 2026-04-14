import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface EventModel {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category?: string;
  image_url?: string;
  created_at?: string;
}

export type InsertEvent = Omit<EventModel, "id" | "created_at">;

// API Calls
export const fetchEvents = async (): Promise<EventModel[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

export const createEvent = async (
  newEvent: InsertEvent,
): Promise<EventModel> => {
  const { data, error } = await supabase
    .from("events")
    .insert([newEvent])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// TanStack Query Hooks Wrapper
export const useAdminEvents = () => {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const addEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  return { eventsQuery, addEventMutation };
};
