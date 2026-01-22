
# Breakfast Burst Planner

A delightful breakfast planning application that helps you organize your morning meals for a great start to each day.

## About the App

Breakfast Burst Planner allows you to:

- Discover new breakfast recipes with a "Surprise me" feature
- Save your favorite breakfast recipes for easy access
- Plan your breakfasts for the entire week with a calendar view
- Create and manage your own custom recipes
- View nutritional information and preparation times

## Features

### Recipe Discovery
Browse through a curated collection of breakfast recipes or use the "Surprise me" feature to discover something new.

### Recipe Management
- View detailed recipe information including ingredients, preparation time, and instructions
- Save favorites for quick access
- Create your own custom recipes with our easy-to-use form

### Meal Planning
Organize your breakfast schedule with our intuitive calendar interface:
- Assign recipes to specific days
- Plan an entire week of breakfasts in advance
- Easily modify your plan as needed

### Image System
The app includes a robust image handling system:
- **Primary images** sourced from Unsplash with optimized URLs for fast loading
- **Smart fallbacks** with automatic retry on failed image loads
- **Graceful degradation** with placeholder icons when images are unavailable
- **Lazy loading** for improved performance
- **ImageLoader component** handles all image states (loading, error, success)

### User Profiles
- Create a personal account to save your preferences
- Access your meal plans and favorite recipes from any device
- **No login required** - app works fully without authentication using localStorage

## Technologies Used

- React 18 with TypeScript
- Vite with SWC for fast builds
- Tailwind CSS for styling
- Shadcn UI for components
- Supabase for backend services (authentication, database, storage)
- React Router for navigation
- Framer Motion for animations
- TanStack React Query for data fetching
- React Hook Form + Zod for form validation

## Getting Started

To run this project locally:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd breakfast-burst-planner

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui primitive components
│   ├── ImageLoader.tsx  # Image loading with fallbacks
│   └── *.tsx        # Custom application components
├── pages/           # Page components (routes)
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── utils/           # Helper functions
│   └── recipeGenerator.ts  # Recipe generation & image URLs
└── types/           # TypeScript type definitions
```

## Deployment

This project can be easily deployed through the Lovable platform. Simply click on Share -> Publish in your Lovable project.

## Custom Domain

You can connect a custom domain to your deployed app through Lovable's Project Settings > Domains section.
