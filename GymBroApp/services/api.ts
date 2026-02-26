import { Filters, Gym, Match, Message, User } from '@/types';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Automatically resolve the backend URL.
// On Android emulator localhost maps to 10.0.2.2; on device use your LAN IP.
// On iOS simulator localhost works fine.
function getBaseUrl(): string {
  // If running in Expo Go, try to use the debuggerHost to reach the same machine
  const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3001/api`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  }
  return 'http://localhost:3001/api';
}

const BASE_URL = getBaseUrl();

// ── Helper ──────────────────────────────────────────────────
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Users ───────────────────────────────────────────────────
export function discoverUsers(currentUserId: number, filters: Filters = {}): Promise<User[]> {
  const params = new URLSearchParams({ currentUserId: String(currentUserId) });
  if (filters.minAge) params.set('minAge', String(filters.minAge));
  if (filters.maxAge) params.set('maxAge', String(filters.maxAge));
  if (filters.type) params.set('type', filters.type);
  if (filters.gymId) params.set('gymId', String(filters.gymId));
  return request<User[]>(`/users/discover?${params}`);
}

export function getUser(id: number): Promise<User> {
  return request<User>(`/users/${id}`);
}

export function updateUser(id: number, data: Partial<User & { exos: string[] }>): Promise<{ success: boolean }> {
  return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function likeUser(myId: number, likedUserId: number): Promise<{ success: boolean; matched: boolean }> {
  return request(`/users/${myId}/like`, {
    method: 'POST',
    body: JSON.stringify({ likedUserId }),
  });
}

export function passUser(myId: number, seenUserId: number): Promise<{ success: boolean }> {
  return request(`/users/${myId}/pass`, {
    method: 'POST',
    body: JSON.stringify({ seenUserId }),
  });
}

export function getMatches(userId: number): Promise<Match[]> {
  return request<Match[]>(`/users/${userId}/matches`);
}

// ── Gyms ────────────────────────────────────────────────────
export function getGyms(): Promise<Gym[]> {
  return request<Gym[]>('/gyms');
}

// ── Relations / Messages ────────────────────────────────────
export function getMessages(relationId: number): Promise<Message[]> {
  return request<Message[]>(`/relations/${relationId}/messages`);
}

export function sendMessage(
  relationId: number,
  fromUserId: number,
  content: string
): Promise<{ success: boolean }> {
  return request(`/relations/${relationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ fromUserId, content }),
  });
}

// ── Attachments ─────────────────────────────────────────────
export function getAttachmentUrl(attachmentId: number | null): string | null {
  if (!attachmentId) return null;
  return `${BASE_URL}/attachments/${attachmentId}`;
}

/**
 * Upload an image and attach it to a user profile.
 * Returns the new attachment id.
 */
export async function uploadProfileImage(userId: number, uri: string, filename: string, mimeType: string): Promise<number> {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: filename,
    type: mimeType,
  } as any);

  const res = await fetch(`${BASE_URL}/attachments`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type — fetch sets the multipart boundary automatically
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const { id: attachmentId } = await res.json();

  // Link it to the user
  await request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ attachment_id: attachmentId }),
  });

  return attachmentId;
}
