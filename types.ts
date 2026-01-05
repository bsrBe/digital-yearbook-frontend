
export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum FriendStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NONE = 'NONE'
}

export interface Signature {
  id: string;
  fromName: string;
  message: string;
  style: 'casual' | 'elegant' | 'bold';
  timestamp: Date;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
  graduationYear: number;
  studentId: string;
  profilePhoto: string;
  quote: string;
  bio: string;
  rememberMeFor: string;
  hobbies: string[];
  achievements: string[];
  socialLinks: SocialLinks;
  isActivated: boolean;
  signatures: Signature[];
}

export interface Memory {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  likes: number;
}

export interface BestMemory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  date: string;
}

// Added ChatMessage interface to resolve the import error in ChatSystem.tsx
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image';
}
