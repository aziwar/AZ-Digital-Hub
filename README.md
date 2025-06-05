# Ahmed Ziwar - Digital Portfolio

A modern, high-performance portfolio website showcasing expertise in Digital Marketing and IT Consulting. Built with the latest web technologies and optimized for exceptional user experience.

![Portfolio Preview](public/og-image.jpg)

## 🚀 Features

### Performance & Optimization
- **Lightning Fast**: Optimized for Core Web Vitals with 95+ Lighthouse scores
 - **Server Components**: Leveraging Next.js 15 App Router for optimal performance
- **Smart Loading**: Dynamic imports and lazy loading for faster initial loads
- **Image Optimization**: Automatic image optimization with Next.js Image component

### Design & UX
- **Modern Animations**: Smooth, performant animations with Framer Motion
- **Responsive Design**: Mobile-first approach with fluid typography and spacing
- **Dark Mode**: Elegant dark theme with careful attention to contrast and readability
- **Interactive Elements**: 3D visualizations, particle effects, and micro-interactions
- **Micro-Interactions**: subtle link hover movement and hero gradient fade

### Technical Features
- **Type Safety**: Full TypeScript implementation with strict mode
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Contact Form**: Validated forms with real-time feedback
- **Analytics**: Integrated with Vercel Analytics and custom tracking

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with container queries and custom design system
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber
- **Forms**: React Hook Form with Zod validation
- **Icons**: Heroicons & React Icons
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AZ-Digital-Hub.git
cd AZ-Digital-Hub
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

5. If you encounter build issues related to animations:
```bash
# Windows
scripts\fix-type-animation.bat

# Linux/Mac
chmod +x scripts/fix-type-animation.sh
./scripts/fix-type-animation.sh
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── api/               # API routes
├── components/
│   ├── sections/          # Page sections
│   ├── ui/                # Reusable UI components
│   ├── layouts/           # Layout components
│   └── features/          # Feature-specific components
├── lib/
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── api/               # API helpers
└── public/                # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#9333ea to #6366f1)
- **Accent**: Cyan (#06b6d4)
- **Neutral**: Slate scale
- **Semantic**: Success (green), Warning (yellow), Error (red)

### Typography
- **Font**: Inter (variable font)
- **Scale**: Fluid typography with clamp()
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Scale**: xs, sm, md, lg, xl, 2xl
- **Responsive**: Fluid spacing with viewport units

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 Environment Variables

```env
# API Keys (if needed)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Email Service (optional)
EMAIL_SERVICE_API_KEY=your-email-service-key

# Database (optional)
DATABASE_URL=your-database-url
```

## 🔧 Performance Optimization

### Current Metrics
- **Lighthouse Performance**: 98/100
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Optimization Techniques
1. **Code Splitting**: Dynamic imports for non-critical components
2. **Image Optimization**: WebP format with responsive sizes
3. **Font Optimization**: Variable fonts with font-display: swap
4. **CSS Optimization**: Tailwind CSS with PurgeCSS
5. **Caching Strategy**: Proper cache headers and ISR
6. **Custom Animations**: Using Framer Motion instead of external animation libraries

### Continuous Integration
- Automated tests run on every PR: linting, type checking, Lighthouse CI and axe-core audits, plus depcheck

### Context7 Optimizations
- **TypeAnimation**: Using custom Framer Motion implementation instead of external library
- **Bundle Size**: Reduced by utilizing existing dependencies
- **Build Process**: Enhanced with automatic dependency validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Ahmed Ziwar - [LinkedIn](https://linkedin.com/in/ahmedziwar) - ahmedziwar@gmail.com

Project Link: [https://github.com/yourusername/AZ-Digital-Hub](https://github.com/yourusername/AZ-Digital-Hub)

---

Built with ❤️ by Ahmed Ziwar
