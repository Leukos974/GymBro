import { Filters, Gym, Match, Message, User } from '@/types';

// Change this to your machine's local IP when testing on a device
const BASE_URL = 'http://localhost:3001/api';

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

export function updateUser(id: number, data: Partial<User>): Promise<{ success: boolean }> {
  return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function likeUser(myId: number, likedUserId: number): Promise<{ success: boolean; matched: boolean }> {
  return request(`/users/${myId}/like`, {
    method: 'POST',
    body: JSON.stringify({ likedUserId }),
  });
}

export function passUser(myId: number): Promise<{ success: boolean }> {
  return request(`/users/${myId}/pass`, { method: 'POST' });
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
