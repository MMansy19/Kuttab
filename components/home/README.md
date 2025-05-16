# Kottab Website Home Page Components

This directory contains the components for the Kottab home page, split into modular sections for better maintainability and performance.

## Component Structure

The home page is divided into the following components:

- **HeroSection**: The main landing section with a headline, call-to-action buttons, and statistics.
- **FeaturesSection**: Displays the key features of the Kottab platform with icons and descriptions.
- **AboutSection**: Information about the platform and its mission with supporting images.
- **TestimonialsSection**: Carousel of testimonials from students and teachers.
- **ContactSection**: Contact form and information for reaching out to the platform.
- **CTASection**: Final call-to-action section to encourage user sign-ups.
- **CounterStat**: Reusable animated counter component for displaying statistics.
- **GradientStyles**: CSS styles for text gradients and animations used throughout the page.

## Usage

All components are exported from the index.ts file for easy imports:

```tsx
import { 
  HeroSection, 
  FeaturesSection, 
  AboutSection, 
  TestimonialsSection,
  ContactSection,
  CTASection 
} from '@/components/home';
```

Each component is designed to be used independently, allowing for easy rearrangement or selective inclusion on different pages.

## Performance Optimizations

- Components are dynamically imported to benefit from code splitting
- Images are optimized and served in WebP format
- Animations use GPU-accelerated properties
- Intersection Observer is used to only animate elements when in view
- Image placeholders are provided via blurDataURL for better loading experience

## Adding New Components

When adding new components to this directory:

1. Create the component file with a descriptive name
2. Export it from the index.ts file
3. Add appropriate documentation to this README
4. Ensure any images used are optimized and in WebP format
5. Consider adding appropriate loading states for dynamic imports

## Maintaining Image Assets

All image assets are stored in `/public/images/` and should be in WebP format for optimal performance. Run the image optimization script when adding new images:

```bash
node scripts/convert-to-webp.js
```
