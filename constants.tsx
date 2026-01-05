
import { User, Role, Memory, BestMemory } from './types';

export const MOCK_STUDENTS: User[] = [
  {
    id: '1',
    fullName: 'Alex Johnson',
    email: 'alex.j@university.edu',
    role: Role.STUDENT,
    department: 'Science',
    graduationYear: 2024,
    studentId: 'CS2024-001',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    quote: 'The future belongs to those who believe in the beauty of their dreams.',
    bio: 'Dedicated to pushing the boundaries of what is possible through technology and innovation.',
    rememberMeFor: 'Always bringing snacks to study sessions.',
    hobbies: ['Photography', 'Reading', 'Hiking'],
    achievements: ["Dean's List", 'Student Council', 'Volunteer of the Year'],
    socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    isActivated: true,
    signatures: [
      { id: 's1', fromName: 'Best Friend', message: 'Thanks for all the memories! Stay in touch!', style: 'elegant', timestamp: new Date() },
      { id: 's2', fromName: 'Professor Smith', message: 'It was a pleasure having you in class. Your future is bright!', style: 'bold', timestamp: new Date() }
    ]
  },
  {
    id: '2',
    fullName: 'Sarah Miller',
    email: 'sarah.m@university.edu',
    role: Role.STUDENT,
    department: 'Arts',
    graduationYear: 2024,
    studentId: 'BA2024-042',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    quote: 'Creativity is intelligence having fun.',
    bio: 'Artist, dreamer, and explorer of the digital realm.',
    rememberMeFor: 'The mural in the student lounge.',
    hobbies: ['Painting', 'Music', 'Travel'],
    achievements: ['Art Excellence Award', 'Exhibition Winner'],
    socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
    isActivated: true,
    signatures: []
  },
  {
    id: '3',
    fullName: 'David Chen',
    email: 'david.c@university.edu',
    role: Role.STUDENT,
    department: 'Business',
    graduationYear: 2024,
    studentId: 'ME2024-112',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    quote: 'Strategy without tactics is the slowest route to victory.',
    bio: 'Entrepreneurial spirit with a focus on sustainable growth.',
    rememberMeFor: 'Founding the campus coffee club.',
    hobbies: ['Chess', 'Cycling', 'Podcasting'],
    achievements: ['Business Case Winner', 'Student Leader'],
    socialLinks: { github: 'https://github.com' },
    isActivated: true,
    signatures: []
  }
];

// Add 20 more mock students for the "Gallery" feel
for (let i = 4; i <= 24; i++) {
  MOCK_STUDENTS.push({
    id: i.toString(),
    fullName: `Student ${i}`,
    email: `student${i}@university.edu`,
    role: Role.STUDENT,
    department: i % 3 === 0 ? 'Science' : i % 3 === 1 ? 'Arts' : 'Business',
    graduationYear: 2024,
    studentId: `ID-2024-${i.toString().padStart(3, '0')}`,
    profilePhoto: `https://picsum.photos/seed/${i}/400/400`,
    quote: 'This is where I’ll leave my mark on the world.',
    bio: 'Excited for the journey ahead.',
    rememberMeFor: 'My dedication to the craft.',
    hobbies: ['Sports', 'Gaming'],
    achievements: ['Participation Certificate'],
    socialLinks: {},
    isActivated: true,
    signatures: []
  });
}

export const MOCK_MEMORIES: Memory[] = MOCK_STUDENTS.slice(0, 12).map((s, i) => ({
  id: `m${i}`,
  userId: s.id,
  userName: s.fullName,
  userPhoto: s.profilePhoto,
  content: "The memories we've made will last a lifetime. I'll never forget the late nights studying, the campus events, and all the friends I've made along the way.",
  timestamp: new Date(2024, 4, 15 - i),
  likes: Math.floor(Math.random() * 50)
}));

export const MOCK_BEST_MEMORIES: BestMemory[] = [
  { id: 'bm1', title: 'Graduation Day', description: "The day we've all been waiting for, filled with joy, tears, and new beginnings.", imageUrl: 'https://images.unsplash.com/photo-1523050335456-c38a7046d28c?auto=format&fit=crop&q=80&w=800', date: 'May 2024', mediaType: 'image' },
  { id: 'bm2', title: 'Senior Prom', description: 'A night of dancing and laughter as we celebrated our final year together.', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', date: 'April 2024', mediaType: 'image' },
  { id: 'bm3', title: 'Last Lecture', description: 'Our final session in the grand hall, reflecting on years of learning.', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', date: 'May 2024', mediaType: 'image' },
  { id: 'bm4', title: 'Campus Tour', description: 'A walk down memory lane.', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', date: 'June 2024', mediaType: 'video' }
];

export const CURRENT_USER: User = MOCK_STUDENTS[0];
export const ADMIN_USER: User = {
  ...MOCK_STUDENTS[0],
  id: 'admin-0',
  fullName: 'Admin User',
  role: Role.ADMIN,
  isActivated: true,
};
