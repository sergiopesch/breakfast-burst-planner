# Agent Guidelines for Breakfast Burst Planner

This document provides guidelines for AI agents working on the Breakfast Burst Planner project.

## Project Overview

Breakfast Burst Planner is a modern React/TypeScript meal planning application focused on breakfast recipes. The app allows users to discover recipes, save favorites, and plan their weekly breakfast meals.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack React Query
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui primitive components
│   └── *.tsx        # Custom application components
├── pages/           # Page components (routes)
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries (Supabase client, utils)
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Key Files

- `src/App.tsx` - Main routing configuration
- `src/components/ThemeProvider.tsx` - Theme context with brand colors
- `src/hooks/useAuth.tsx` - Authentication hook
- `src/hooks/useMealPlanner.tsx` - Meal planning state management
- `src/lib/supabase.ts` - Supabase client configuration
- `tailwind.config.ts` - Tailwind CSS configuration with custom colors
- `src/index.css` - Global styles and custom CSS utilities
- `src/components/ImageLoader.tsx` - Image loading with fallback handling
- `src/utils/recipeGenerator.ts` - Recipe generation and image URL constants

## Design System

### Brand Colors

```typescript
colors: {
  primary: '#4F2D9E',      // Deep purple
  secondary: '#7E5BC2',    // Light purple
  accent: '#E5DEFF',       // Soft purple
  warm: '#E08D3C',         // Orange accent
  success: '#22C55E',      // Green
}
```

### Typography

- Headings: `font-semibold` (Inter font family)
- Body: `font-normal`
- Use `text-gradient` class for gradient text effects

### Components

The project uses shadcn/ui components with custom styling:
- Cards use `neumorphic` or `glass` classes for elevated effects
- Buttons use `btn-glow` class for hover effects
- Use `card-hover` for interactive card animations

### Spacing & Layout

- Use Tailwind's spacing scale (4, 6, 8, etc.)
- Container max-width: 1400px
- Standard padding: `p-6 md:p-8 lg:p-12`

## Coding Conventions

### File Naming

- Components: PascalCase (`RecipeCard.tsx`)
- Hooks: camelCase with `use` prefix (`useMealPlanner.tsx`)
- Utils: camelCase (`getUserName.ts`)

### Component Structure

```typescript
import React from 'react';
// External imports
// Internal imports (components, hooks, utils)
// Types

interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return (
    // JSX
  );
};

export default Component;
```

### Styling

1. Prefer Tailwind utility classes over custom CSS
2. Use the brand color classes (`brand-purple`, `brand-warm`, etc.)
3. Use CSS variables for theming (defined in `index.css`)
4. Apply responsive design with mobile-first approach

### State Management

- Use React Query for server state
- Use React Context for global UI state (auth, theme)
- Use local state for component-specific UI

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. If protected, wrap with `ProtectedRoute`

### Adding a New Component

1. Create in `src/components/`
2. Use existing shadcn/ui primitives where possible
3. Follow the design system for styling

### Working with Supabase

- Use the client from `src/lib/supabase.ts`
- Handle errors with `handleSupabaseError()`
- For images, use `uploadRecipeImage()` helper

## Testing

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Important Notes

1. **No Login Required**: The app works fully without authentication. All features (planner, recipes, create recipe) are accessible to anonymous users via localStorage. Only `/profile` requires authentication.
2. **Data Storage**:
   - **Logged-in users**: Data syncs to Supabase (recipes, meal plans, images)
   - **Anonymous users**: Data stored in localStorage (`likedRecipes`, `customRecipes`, `mealPlans`)
3. **Image Handling**:
   - Use `ImageLoader` component for all recipe images
   - Import `BREAKFAST_IMAGE_URLS` from `@/utils/recipeGenerator` for reliable image URLs
   - ImageLoader handles loading states, errors, retries, and fallbacks automatically
   - For logged-in users, images can be stored in Supabase Storage with cache busting
4. **Local Fallback**: The app gracefully falls back to localStorage when Supabase is unavailable or user is not logged in.
5. **Accessibility**: Use ARIA labels, semantic HTML, and keyboard navigation support

## Image System

Always use the `ImageLoader` component for recipe images:

```tsx
import ImageLoader from '@/components/ImageLoader';
import { BREAKFAST_IMAGE_URLS } from '@/utils/recipeGenerator';

// Using ImageLoader
<ImageLoader
  src={BREAKFAST_IMAGE_URLS.pancakes}
  alt="Pancakes"
  className="w-full h-full object-cover"
/>

// Available images:
// BREAKFAST_IMAGE_URLS.pancakes, .avocadoToast, .smoothie,
// .oatmeal, .frenchToast, .granola, .sandwich
```
