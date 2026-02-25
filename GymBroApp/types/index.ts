// ── GymBro Types ────────────────────────────────────────────

export type ExerciseType = 'mass_gain' | 'mass_loss' | 'cardio' | 'strength' | 'flexibility';

export interface User {
  id: number;
  name: string;
  family_name: string;
  age: number;
  type: ExerciseType;
  description: string | null;
  gym_id: number | null;
  attachment_id: number | null;
  gym_name?: string;
  gym_location?: string;
  exos: string[];
  /** Local image URI (for mock data) or remote URL */
  imageUri?: string | null;
}

export interface Gym {
  id: number;
  name: string;
  location: string;
  attachment_id: number | null;
}

export interface Match {
  relation_id: number;
  partner_id: number;
  name: string;
  family_name: string;
  age: number;
  type: ExerciseType;
  attachment_id: number | null;
  gym_name?: string;
}

export interface Message {
  id: number;
  relation_id: number;
  from_user_id: number;
  content: string;
  sent_at: string;
  from_name: string;
}

export interface Filters {
  minAge?: number;
  maxAge?: number;
  type?: ExerciseType | '';
  gymId?: number | null;
}

/** Map exercise type to a displayable label + icon name (MaterialCommunityIcons) */
export const EXERCISE_TYPE_META: Record<ExerciseType, { label: string; icon: string; color: string }> = {
  mass_gain:   { label: 'Mass Gain',   icon: 'dumbbell',       color: '#E74C3C' },
  mass_loss:   { label: 'Mass Loss',   icon: 'fire',           color: '#F39C12' },
  cardio:      { label: 'Cardio',      icon: 'run-fast',       color: '#3498DB' },
  strength:    { label: 'Strength',    icon: 'arm-flex',       color: '#8E44AD' },
  flexibility: { label: 'Flexibility', icon: 'yoga',           color: '#27AE60' },
};
