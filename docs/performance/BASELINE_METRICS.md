# Performance Baseline Metrics
**Captured**: 2025-10-14 before tailwindcss-animate full migration
**Branch**: main
**Commit**: Pre-migration baseline

## Build Metrics

### Bundle Sizes
```
Route (app)              Size      First Load JS
/[locale]                20.2 kB   141 kB
├ /en                    -          -
└ /ar                    -          -
Shared chunks            102 kB
Middleware               45.3 kB
```

### CSS Bundle
```
File: .next/static/css/aea62dd8861e58d8.css
Size: 55 KB (56,320 bytes)
```

### Build Performance
```
Compile time: ~1.8 seconds
Total build time: ~8 seconds
Pages generated: 8/8 static
```

## Animation Inventory

### Custom Keyframes (20+ animations)
1. **Mount-triggered** (candidates for plugin):
   - fadeIn, fadeOut
   - text-reveal
   - loadingScaleIn, loadingSlideUp, loadingDotPulse
   - scaleHover
   
2. **Scroll-triggered** (keep custom):
   - observe-fade-in
   - observe-slide-left, observe-slide-right
   - observe-stagger-children

3. **Complex** (keep custom):
   - fadeInStagger (with CSS variables)
   - typewriter + blink-caret
   - magneticPull, successPulse
   - shake, parallaxFloat
   - sectionDivider

### Component Usage
- Services.tsx: observe-*, text-animate-*, btn-*, animate-stagger
- EnhancedHero.tsx: text-animate-reveal, btn-magnetic
- EnhancedContact.tsx: btn-*, animate-*, parallaxFloat
- ROIChart.tsx: animate-stagger
- LoadingScreen.tsx: loading-* (already migrated to CSS)

## Expected Improvements

### Bundle Size
- Current CSS: 55 KB
- Target: 46-47 KB (15-25% reduction)
- Rationale: Keeping Intersection Observer animations limits savings

### Performance
- Current FPS: Unknown (needs measurement)
- Target: 60fps consistently
- Current build time: ~8 seconds
- Target: Maintain or improve

### Code Quality
- Reduced custom CSS maintenance
- Standardized animation patterns
- Better browser optimization via plugin
- RTL support via wrapper utilities

## Migration Scope

### Will Migrate (~30-40% of animations):
- LoadingScreen animations ✅ (done)
- Services badge ✅ (done)
- EnhancedHero text-reveal
- Button hover states (btn-magnetic, btn-enhanced)
- Form validation (shake, slideInUp)

### Will Keep (~60-70% of animations):
- ALL Intersection Observer patterns
- Complex multi-stage animations
- Staggered scroll animations
- RTL-critical custom patterns
