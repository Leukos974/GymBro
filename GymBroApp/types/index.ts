export interface User {
  id: number;
  name: string;
  photo: any; // require() image
  gym: string;
  level: string;
  objective: string;
  availability: string;
  description: string;
}

export interface Match {
  id: number;
  user: User;
  isTopMatch: boolean;
}

export interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  matchUser: User;
  messages: Message[];
}

export interface Gym {
  id: number;
  name: string;
  logo: any;
}

export interface Filters {
  minAge?: number;
  maxAge?: number;
  type?: string;
  gymId?: number;
}
