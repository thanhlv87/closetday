export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id:string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// ClosetDay Application Types
export interface Outfit {
  id: string;
  date: number; // epoch millis
  images: string[]; // Can be URLs (for seeding) or base64 data URLs (for uploads)
  tags: string[];
  notes?: string;
}