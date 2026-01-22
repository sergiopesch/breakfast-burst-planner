# Claude Code Guidelines for Breakfast Burst Planner

This file provides specific instructions for Claude when working on this project.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Project Context

Breakfast Burst Planner is a breakfast-focused meal planning app that works **without requiring login**. Users can:
- Discover breakfast recipes with a "Surprise me" feature
- Save favorite recipes (localStorage for anonymous, Supabase for logged-in)
- Plan weekly breakfast meals on a calendar
- Create custom recipes
- Optionally sign in to sync data across devices

## Architecture Overview

```
Frontend (React + TypeScript + Vite)
    ├── UI Layer (shadcn/ui + Tailwind CSS)
    ├── State Layer (React Query + Context)
    └── Data Layer (Supabase client)

Backend (Supabase)
    ├── PostgreSQL Database
    ├── Authentication (Email + OAuth)
    └── Storage (Recipe images)
```

## Key Patterns

### Component Styling

Use the established design tokens:

```tsx
// Good - uses design system
<div className="glass rounded-2xl p-6 shadow-soft">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
  <Button className="btn-glow bg-gradient-to-r from-brand-purple to-brand-purple-light">
    Action
  </Button>
</div>

// Avoid - hardcoded colors
<div className="bg-white rounded-lg p-4 shadow">
  <h2 className="text-[#333]">Title</h2>
</div>
```

### Custom CSS Classes

Available utility classes (defined in `src/index.css`):

| Class | Description |
|-------|-------------|
| `.glass` | Glassmorphism effect with blur |
| `.neumorphic` | Soft shadow card effect |
| `.gradient-primary` | Purple gradient background |
| `.gradient-soft` | Soft multi-color background |
| `.gradient-warm` | Warm orange-purple gradient |
| `.text-gradient` | Gradient text effect |
| `.btn-glow` | Button with glow on hover |
| `.card-hover` | Card lift effect on hover |
| `.fade-up` | Fade up entrance animation |
| `.shimmer` | Loading skeleton effect |

### Authentication Pattern

The app works without login. Use authentication conditionally:

```tsx
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, signIn, signOut } = useAuth();

  // Most features work for both anonymous and logged-in users
  const saveData = () => {
    if (user) {
      // Save to Supabase for logged-in users
      await supabase.from('table').insert(data);
    } else {
      // Save to localStorage for anonymous users
      localStorage.setItem('key', JSON.stringify(data));
      window.dispatchEvent(new Event('storage')); // Trigger updates
    }
  };

  return (
    <div>
      {user ? `Welcome, ${user.email}` : 'Welcome, Guest!'}
    </div>
  );
};
```

Only use `ProtectedRoute` for user-specific pages like `/profile`:

```tsx
// Protected (requires login)
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

// Public (works without login)
<Route path="/planner" element={<Layout><Planner /></Layout>} />
```

### Data Fetching Pattern

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Fetching
const { data, isLoading, error } = useQuery({
  queryKey: ['recipes', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },
});

// Mutations
const mutation = useMutation({
  mutationFn: async (newRecipe) => {
    const { error } = await supabase
      .from('recipes')
      .insert(newRecipe);
    if (error) throw error;
  },
});
```

### Toast Notifications

```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success
toast({
  title: "Success!",
  description: "Recipe saved to favorites",
  duration: 2000,
});

// Error
toast({
  title: "Error",
  description: "Failed to save recipe",
  variant: "destructive",
});
```

## Common Modifications

### Adding a New Recipe Field

1. Update the `Recipe` type in `src/hooks/useMealPlanner.tsx`
2. Update the form in `src/pages/CreateRecipe.tsx`
3. Update `RecipeCard.tsx` to display the new field
4. Update Supabase schema if needed

### Modifying Theme Colors

1. Edit CSS variables in `src/index.css` (`:root` section)
2. Update Tailwind colors in `tailwind.config.ts`
3. Update `ThemeProvider.tsx` for the theme context

### Adding New Pages

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
```tsx
// Public page (recommended - works without login)
<Route path="/new-page" element={<Layout><NewPage /></Layout>} />

// Protected page (only if it requires user-specific data)
<Route path="/new-page" element={
  <ProtectedRoute>
    <Layout><NewPage /></Layout>
  </ProtectedRoute>
} />
```
3. Add navigation link in `MainNav.tsx` if needed
4. Ensure the page handles both logged-in and anonymous users via localStorage fallback

## File Locations Reference

| Feature | File |
|---------|------|
| Routes | `src/App.tsx` |
| Global styles | `src/index.css` |
| Tailwind config | `tailwind.config.ts` |
| Theme colors | `src/components/ThemeProvider.tsx` |
| Auth logic | `src/hooks/useAuth.tsx` |
| Meal planning | `src/hooks/useMealPlanner.tsx` |
| Supabase client | `src/lib/supabase.ts` |
| Recipe card | `src/components/RecipeCard.tsx` |
| Navigation | `src/components/NavBar.tsx` |
| Layout | `src/components/Layout.tsx` |

## Supabase Tables

### `recipes`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `title` (text)
- `description` (text)
- `prep_time` (text)
- `image_url` (text)
- `image_path` (text)
- `ingredients` (text array)
- `instructions` (text array)
- `servings` (integer)
- `created_at` (timestamp)

### `meal_plans`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `date` (date)
- `recipe_id` (uuid, foreign key)
- `created_at` (timestamp)

## Do's and Don'ts

### Do
- Use TypeScript strictly (no `any` types)
- Follow the established component patterns
- Use the design system colors and utilities
- Handle loading and error states
- Provide accessible markup (ARIA labels, semantic HTML)
- Use React Query for server state

### Don't
- Hardcode colors - use CSS variables or Tailwind classes
- Skip error handling for async operations
- Create new global styles without good reason
- Mix styling approaches (stick to Tailwind + design system)
- Ignore TypeScript errors

## Useful Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:8080

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check without building
```
