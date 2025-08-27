// Image Configuration - TypeScript version with proper type definitions
export interface ImageConfig {
  profile: {
    linkedin: string;
    profileImage: string;
    fallback: string;
  };
  brand: {
    logo: string;
    favicon: string;
  };
  hero: {
    background: string;
    pattern: string;
    kuwait: string;
  };
  services: {
    seo: string;
    social: string;
    content: string;
    email: string;
    analytics: string;
    automation: string;
  };
}

export const imageConfig: ImageConfig = {
  // Profile Image - Stored locally
  profile: {
    linkedin: "https://www.linkedin.com/in/ahmedzewar",
    profileImage: "/images/ahmed-zewar-profile.jpeg", // Local profile image
    fallback: "/images/ahmed-zewar-profile.jpeg"
  },
  
  // Brand Assets - Your AMZ logo
  brand: {
    logo: "/images/AMZ-logo-tr.png", // Your local logo file
    favicon: "/favicon.ico"
  },
  
  // Hero Section - Using Kuwait business-themed backgrounds
  hero: {
    background: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&q=80",
    pattern: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&q=80",
    kuwait: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920&h=1080&fit=crop&q=80"
  },
  
  // Service Icons - Digital Marketing Themed
  services: {
    seo: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=400&fit=crop&q=80",
    social: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop&q=80", 
    content: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&q=80",
    email: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=400&fit=crop&q=80",
    analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&q=80",
    automation: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&q=80"
  }
};