# Component Creation Script
# Creates the OptimizedImage component

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Creating OptimizedImage component..." -ForegroundColor Gray

# Ensure directory exists
$uiDir = "$projectRoot\src\components\ui"
if (-not (Test-Path $uiDir)) {
    New-Item -ItemType Directory -Path $uiDir -Force | Out-Null
}

# Create OptimizedImage component
$componentContent = @'
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`bg-slate-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-slate-500">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}
'@

$componentContent | Out-File -FilePath "$uiDir\OptimizedImage.tsx" -Encoding UTF8
Write-Host "✅ OptimizedImage component created" -ForegroundColor Green
