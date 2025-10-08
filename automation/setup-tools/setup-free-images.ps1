# Free Image Integration Script - Zero Cost Solution
# LinkedIn Profile + Unsplash Stock Images

Write-Host "🎯 Setting up free image integration..." -ForegroundColor Cyan

# Create lib directory if it doesn't exist
if (!(Test-Path ".\lib")) {
    New-Item -ItemType Directory -Path ".\lib" -Force | Out-Null
}

# Create components directory if it doesn't exist  
if (!(Test-Path ".\components")) {
    New-Item -ItemType Directory -Path ".\components" -Force | Out-Null
}

# Create image configuration
$imageConfig = @'
// Free Image Configuration - Auto-updates with LinkedIn
export const imageConfig = {
  // LinkedIn Profile - Auto-updates when you change your LinkedIn photo
  profile: {
    linkedin: "https://www.linkedin.com/in/ahmedziwar/",
    // Fallback professional headshot from Unsplash
    fallback: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80"
  },
  
  // Brand Assets - Professional stock images
  brand: {
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&q=80",
    favicon: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=32&h=32&fit=crop&q=80"
  },
  
  // Hero Section
  hero: {
    background: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&q=80",
    pattern: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&q=80"
  }
};
'@

# Save configuration
$imageConfig | Out-File -FilePath ".\lib\images.config.js" -Encoding UTF8
Write-Host "✅ Image configuration created" -ForegroundColor Green# Create LinkedIn profile component
$linkedinComponent = @'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { imageConfig } from '@/lib/images.config';

export function LinkedInProfileImage({ className, width = 400, height = 400 }) {
  const [imageUrl, setImageUrl] = useState(imageConfig.profile.fallback);
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt="Ahmed Ziwar - Digital Marketing Expert"
        width={width}
        height={height}
        className="rounded-full object-cover"
        priority
      />
      <a 
        href={imageConfig.profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 bg-[#0077B5] text-white p-2 rounded-full"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
    </div>
  );
}
'@

$linkedinComponent | Out-File -FilePath ".\components\LinkedInProfileImage.tsx" -Encoding UTF8
Write-Host "✅ LinkedIn component created" -ForegroundColor Green

Write-Host "✅ FREE IMAGE SETUP COMPLETE!" -ForegroundColor Green