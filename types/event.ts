export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  image_url?: string;
  created_at: string;
  created_by: string;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  image_url?: string;
  created_by: string;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {}
