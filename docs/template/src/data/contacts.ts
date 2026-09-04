/**
 * Contacts Mock Data
 * Contains sample contacts for the Contacts app
 */

export interface Contact {
  id: number
  avatar: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  location: string
  status: 'active' | 'inactive' | 'pending'
  joinedDate: string
  lastActive: string
  bio: string
}

// Available options for filters and forms
export const departments = ['All', 'Product', 'Engineering', 'Design', 'Marketing', 'Human Resources', 'Analytics', 'Sales']
export const statuses = ['All', 'Active', 'Inactive', 'Pending']
export const roles = [
  'Product Manager',
  'Senior Developer',
  'UX Designer',
  'Marketing Lead',
  'HR Manager',
  'Data Analyst',
  'Sales Director',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Project Manager',
]

// Mock data for contacts
export const contactsData: Contact[] = [
  {
    id: 1,
    avatar: '/assets/avatars/avatar1.jpg',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    status: 'active',
    joinedDate: '2023-03-15',
    lastActive: '2 hours ago',
    bio: 'Experienced product manager with 8+ years in tech industry. Passionate about building user-centric products.',
  },
  {
    id: 2,
    avatar: '/assets/avatars/avatar2.jpg',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    role: 'Senior Developer',
    department: 'Engineering',
    location: 'Seattle, WA',
    status: 'active',
    joinedDate: '2022-08-20',
    lastActive: '5 minutes ago',
    bio: 'Full-stack developer specializing in React and Node.js. Open source contributor and tech blogger.',
  },
  {
    id: 3,
    avatar: '/assets/avatars/avatar3.jpg',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    role: 'UX Designer',
    department: 'Design',
    location: 'Austin, TX',
    status: 'active',
    joinedDate: '2023-01-10',
    lastActive: '1 day ago',
    bio: 'Creative UX designer focused on creating delightful user experiences. Design system enthusiast.',
  },
  {
    id: 4,
    avatar: '/assets/avatars/avatar4.jpg',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1 (555) 456-7890',
    role: 'Marketing Lead',
    department: 'Marketing',
    location: 'New York, NY',
    status: 'inactive',
    joinedDate: '2021-11-05',
    lastActive: '2 weeks ago',
    bio: 'Digital marketing expert with expertise in growth hacking and brand strategy.',
  },
  {
    id: 5,
    avatar: '/assets/avatars/avatar5.jpg',
    name: 'Amanda Foster',
    email: 'amanda.foster@company.com',
    phone: '+1 (555) 567-8901',
    role: 'HR Manager',
    department: 'Human Resources',
    location: 'Chicago, IL',
    status: 'active',
    joinedDate: '2022-05-18',
    lastActive: '3 hours ago',
    bio: 'People-focused HR professional dedicated to building inclusive workplace cultures.',
  },
  {
    id: 6,
    avatar: '/assets/avatars/avatar6.jpg',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: '+1 (555) 678-9012',
    role: 'Data Analyst',
    department: 'Analytics',
    location: 'Boston, MA',
    status: 'pending',
    joinedDate: '2024-01-08',
    lastActive: 'Just now',
    bio: 'Data-driven analyst with strong skills in SQL, Python, and visualization tools.',
  },
  {
    id: 7,
    avatar: '/assets/avatars/avatar7.jpg',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    phone: '+1 (555) 789-0123',
    role: 'Sales Director',
    department: 'Sales',
    location: 'Los Angeles, CA',
    status: 'active',
    joinedDate: '2020-09-12',
    lastActive: '30 minutes ago',
    bio: 'Results-oriented sales leader with proven track record of exceeding targets.',
  },
  {
    id: 8,
    avatar: '/assets/avatars/avatar8.jpg',
    name: 'Robert Martinez',
    email: 'robert.martinez@company.com',
    phone: '+1 (555) 890-1234',
    role: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Denver, CO',
    status: 'active',
    joinedDate: '2023-06-22',
    lastActive: '1 hour ago',
    bio: 'Infrastructure specialist focused on CI/CD, Kubernetes, and cloud architecture.',
  },
]
