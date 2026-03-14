/**
 * Authenticated API utility — wraps fetch with the NextAuth Bearer token.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiCall<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? detail;
    } catch {
      // keep default message
    }
    throw new ApiError(res.status, detail);
  }

  return res.json() as Promise<T>;
}

// ─── Typed helpers ───────────────────────────────────────────────────────────

export interface LyricsGenerateRequest {
  input_prompt: string;
  language: string;
  genre: string;
  title?: string;
}

export interface LyricsGenerateResponse {
  lyrics: string;
  title: string;
  language: string;
  genre: string;
}

export interface AudioGenerateRequest {
  lyrics: string;
  title: string;
  input_prompt?: string;
  language: string;
  genre: string;
}

export interface AudioGenerateResponse {
  track_id: number;
  status: string;
}

export interface CopyrightCheckRequest {
  lyrics: string;
  title?: string;
}

export interface CopyrightCheckResponse {
  safe: boolean;
  score: number;
  matches: { title: string; artist: string; similarity: number }[];
  note?: string | null;
}

export interface Track {
  id: number;
  user_id: number;
  title: string;
  input_prompt: string;
  language: string;
  genre: string;
  generated_lyrics?: string | null;
  audio_url?: string | null;
  status: "pending" | "generating_audio" | "completed" | "failed";
  error_message?: string | null;
  copyright_safe?: boolean | null;
  copyright_score?: number | null;
  duration_seconds?: number | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface GenreCount { genre: string; count: number; }
export interface LanguageCount { language: string; count: number; }
export interface DayCount { date: string; count: number; }

export interface AnalyticsResponse {
  total: number;
  completed: number;
  in_progress: number;
  failed: number;
  copyright_safe_count: number;
  copyright_unsafe_count: number;
  avg_copyright_score: number | null;
  by_genre: GenreCount[];
  by_language: LanguageCount[];
  by_day: DayCount[];
}

export interface TrackListResponse {
  tracks: Track[];
  total: number;
}

// Convenience wrappers
export const generateLyrics = (
  body: LyricsGenerateRequest,
  token: string,
) =>
  apiCall<LyricsGenerateResponse>("/api/generate/lyrics", {
    method: "POST",
    body: JSON.stringify(body),
  }, token);

export const generateAudio = (
  body: AudioGenerateRequest,
  token: string,
) =>
  apiCall<AudioGenerateResponse>("/api/generate/audio", {
    method: "POST",
    body: JSON.stringify(body),
  }, token);

export const checkCopyright = (
  body: CopyrightCheckRequest,
  token: string,
  trackId?: number,
) =>
  apiCall<CopyrightCheckResponse>(
    `/api/generate/copyright-check${trackId ? `?track_id=${trackId}` : ""}`,
    { method: "POST", body: JSON.stringify(body) },
    token,
  );

export const fetchTracks = (token: string) =>
  apiCall<TrackListResponse>("/api/tracks", {}, token);

export const fetchTrack = (id: number, token: string) =>
  apiCall<Track>(`/api/tracks/${id}`, {}, token);

export const deleteTrack = (id: number, token: string) =>
  apiCall<{ message: string }>(`/api/tracks/${id}`, { method: "DELETE" }, token);

/** Full URL for an audio file served from the backend */
export const audioSrc = (audioUrl: string) =>
  `${API_URL}${audioUrl}`;

export const publishTrack = (id: number, token: string) =>
  apiCall<Track>(`/api/tracks/${id}/publish`, { method: "POST" }, token);

export const unpublishTrack = (id: number, token: string) =>
  apiCall<Track>(`/api/tracks/${id}/unpublish`, { method: "POST" }, token);

export const fetchAnalytics = (token: string) =>
  apiCall<AnalyticsResponse>("/api/analytics", {}, token);

// ─── Payments ────────────────────────────────────────────────────────────────

export interface LemonSqueezyCheckoutResponse {
  checkout_url: string;
}

export interface RazorpayOrderResponse {
  order_id: string;
  key_id: string;
  amount: number;
  currency: string;
}

export interface SubscriptionResponse {
  plan_slug: string;
  provider: string;
  current_period_ends_at: string | null;
}

export const createLemonSqueezyCheckout = (plan: string, accessToken: string) =>
  apiCall<LemonSqueezyCheckoutResponse>("/api/payments/checkout/lemonsqueezy", {
    method: "POST",
    body: JSON.stringify({ plan }),
  }, accessToken);

export const createRazorpayOrder = (plan: string, accessToken: string) =>
  apiCall<RazorpayOrderResponse>("/api/payments/checkout/razorpay", {
    method: "POST",
    body: JSON.stringify({ plan }),
  }, accessToken);

export const getSubscription = (accessToken: string) =>
  apiCall<SubscriptionResponse>("/api/payments/subscription", {}, accessToken);
