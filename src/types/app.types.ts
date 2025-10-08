// Base types
export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  locale?: string;
  siteName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[]>;
}

// Component props
export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string | number;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

// Form types
export interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  [key: string]: unknown;
}

// Project types
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  images: string[];
  tags: string[];
  technologies: string[];
  client?: string;
  year?: number;
  url?: string;
  githubUrl?: string;
  isFeatured?: boolean;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
  seo?: SeoMetadata;
}

// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  tags: string[];
  readTime: number;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
  seo?: SeoMetadata;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface MainNavItem extends NavItem {
  items?: NavItem[];
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  light: string;
  dark: string;
  system: string;
}

// Utility types
export type ValueOf<T> = T[keyof T];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & Record<string, never>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Nullable<T> = T | null | undefined;
