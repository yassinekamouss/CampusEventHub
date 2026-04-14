import { CreateEventDTO, Event, UpdateEventDTO } from "../types/event";
import { supabase } from "./supabase";

export const eventService = {
  /**
   * Fetches all upcoming events, ordered by date ascending.
   */
  getUpcomingEvents: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true });

    if (error) {
      throw new Error(`Error fetching events: ${error.message}`);
    }

    return data as Event[];
  },

  /**
   * Fetches all recent events, ordered by date descending.
   */
  getRecentEvents: async (limit: number = 5): Promise<Event[]> => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching recent events: ${error.message}`);
    }

    return data as Event[];
  },

  /**
   * Fetches a single event by id.
   */
  getEventById: async (id: string): Promise<Event> => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching event ${id}: ${error.message}`);
    }

    return data as Event;
  },

  /**
   * Creates a new event.
   */
  createEvent: async (eventData: CreateEventDTO): Promise<Event> => {
    const { data, error } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }

    return data as Event;
  },

  /**
   * Updates an existing event.
   */
  updateEvent: async (
    id: string,
    eventData: UpdateEventDTO,
  ): Promise<Event> => {
    const { data, error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating event ${id}: ${error.message}`);
    }

    return data as Event;
  },

  /**
   * Deletes an event.
   */
  deleteEvent: async (id: string): Promise<void> => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting event ${id}: ${error.message}`);
    }
  },

  /**
   * Fetches general statistics for events.
   */
  getEventStats: async (): Promise<{
    totalEvents: number;
    upcomingEvents: number;
  }> => {
    const { count: totalEvents, error: totalError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    if (totalError) {
      throw new Error(
        `Error fetching total events count: ${totalError.message}`,
      );
    }

    const { count: upcomingEvents, error: upcomingError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("date", new Date().toISOString());

    if (upcomingError) {
      throw new Error(
        `Error fetching upcoming events count: ${upcomingError.message}`,
      );
    }

    return {
      totalEvents: totalEvents || 0,
      upcomingEvents: upcomingEvents || 0,
    };
  },

  /**
   * Checks if a user is registered for a specific event.
   */
  checkRegistration: async (
    eventId: string,
    userId: string,
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // Ignore 'Not found' error
      throw new Error(`Error checking registration: ${error.message}`);
    }

    return !!data;
  },

  /**
   * Registers a user for a specific event.
   */
  registerForEvent: async (eventId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("registrations")
      .insert([{ event_id: eventId, user_id: userId }]);

    if (error) {
      throw new Error(`Error registering for event: ${error.message}`);
    }
  },

  /**
   * Unregisters a user from a specific event.
   */
  unregisterFromEvent: async (
    eventId: string,
    userId: string,
  ): Promise<void> => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .match({ event_id: eventId, user_id: userId });

    if (error) {
      throw new Error(`Error unregistering from event: ${error.message}`);
    }
  },

  /**
   * Fetches total registrations across all events.
   */
  getTotalRegistrations: async (): Promise<number> => {
    const { count, error } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Error fetching total registrations: ${error.message}`);
    }

    return count || 0;
  },

  /**
   * Fetches events the user is registered for.
   */
  getUserRegistrations: async (userId: string): Promise<Event[]> => {
    const { data, error } = await supabase
      .from("registrations")
      .select("events(*)")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Error fetching user registrations: ${error.message}`);
    }

    // Map correctly since the join returns [{ events: { ...eventData } }]
    const events = data?.map((item: any) => item.events).filter(Boolean) || [];
    return events as Event[];
  },

  /**
   * Placeholder for event image upload.
   */
  uploadEventImage: async (file: object): Promise<string> => {
    // Implement actual file uploading logic via Supabase Storage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://example.com/placeholder.png");
      }, 500);
    });
  },
};
