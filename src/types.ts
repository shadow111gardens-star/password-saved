export interface PasswordEntry {
  id: string;
  websiteName: string;
  websiteUrl: string;
  username: string;
  email: string;
  password: string;
  category: string;
  tags: string[];
  notes: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  customFields: { label: string; value: string }[];
}

export type ViewType =
  | 'landing'
  | 'dashboard'
  | 'vault'
  | 'favorites'
  | 'categories'
  | 'generator'
  | 'security'
  | 'importexport'
  | 'notes'
  | 'profile'
  | 'settings';

export const CATEGORIES = [
  'Personal',
  'Work',
  'Finance',
  'Shopping',
  'Development',
  'Hosting',
  'Client',
  'Social',
  'Entertainment',
  'Other',
];

export const INITIAL_PASSWORDS: PasswordEntry[] = [];
