
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, ArrowRight, Play, ChefHat, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import VideoHero from '@/components/VideoHero';
import { ScrollReveal, StaggerContainer, StaggerItem, Counter } from '@/components/ScrollReveal';
import OptimizedImage from '@/components/OptimizedImage';
import { BREAKFAST_RECIPES } from '@/components/RecipeCard';

// Lazy load heavy components
const RecipeCard = lazy(() => import('@/components/RecipeCard'));

// Premium breakfast images from Unsplash
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1920&q=80',
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1920&q=80',
  'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1920&q=80',
];

const FEATURE_IMAGES = {
  discover: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
  plan: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80',
  enjoy: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
};

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [recipeKey, setRecipeKey] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(() =>
    BREAKFAST_RECIPES[Math.floor(Math.random() * BREAKFAST_RECIPES.length)]
  );
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    setIsVisible(true);

    // Rotate hero images
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    // Load favorite count
    const loadFavorites = () => {
      try {
        const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        setFavoriteCount(likedRecipes.length);
      } catch (error) {
        setFavoriteCount(0);
      }
    };

    loadFavorites();

    const handleStorageChange = () => loadFavorites();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  const handleRandomize = () => {
    setIsSpinning(true);
    const recipes = BREAKFAST_RECIPES.filter(recipe => recipe.id !== currentRecipe.id);
    const newRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    setTimeout(() => {
      setCurrentRecipe(newRecipe);
      setRecipeKey(prev => prev + 1);
      setIsSpinning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Video */}
      <VideoHero
        height="h-screen"
        overlay={true}
        overlayOpacity={0.5}
        parallax={true}
        showControls={false}
      >
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            style={{ opacity: heroOpacity }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block text-xs font-medium tracking-[0.3em] uppercase text-foreground/60 mb-6">
                Elevate Your Mornings
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground mb-8"
            >
              Rise &{' '}
              <span className="text-gradient italic">Dine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-foreground/70 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Discover curated breakfast recipes and plan your perfect morning routine
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/planner">
                <Button
                  size="lg"
                  className="btn-primary rounded-full px-8 py-6 text-base font-medium group"
                >
                  Start Planning
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/recipes">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium border-foreground/20 hover:bg-foreground/5"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Explore Recipes
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </VideoHero>

      {/* Stats Section */}
      <section className="py-20 border-b border-border/30">
        <div className="container mx-auto px-6">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: 50, suffix: '+', label: 'Curated Recipes' },
              { value: 1000, suffix: '+', label: 'Happy Mornings' },
              { value: 15, suffix: 'min', label: 'Avg Prep Time' },
              { value: 5, suffix: '', label: 'Star Rating' },
            ].map((stat, index) => (
              <StaggerItem key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-medium text-foreground mb-2">
                  <Counter to={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Recipe Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <ScrollReveal animation="fadeRight">
              <div className="max-w-lg">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
                  Featured Today
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6 tracking-tight">
                  Today's Inspiration
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Let us surprise you with a carefully selected breakfast idea. Each recipe is crafted for taste, nutrition, and simplicity.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Button
                    onClick={handleRandomize}
                    variant="outline"
                    className="group rounded-full px-6 border-border/50 hover:border-foreground/30"
                    disabled={isSpinning}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 transition-transform duration-500 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'}`}
                    />
                    Surprise Me
                  </Button>

                  <AnimatePresence>
                    {favoriteCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50"
                      >
                        <Heart className="h-4 w-4 fill-foreground/60 text-foreground/60" />
                        <span className="text-sm font-medium text-foreground/80">
                          {favoriteCount} saved
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/recipes"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>View all recipes</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Recipe Card */}
            <ScrollReveal animation="fadeLeft" delay={0.2}>
              <motion.div
                key={recipeKey}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Suspense fallback={<div className="aspect-[4/3] bg-secondary/50 rounded-2xl shimmer" />}>
                  <RecipeCard recipe={currentRecipe} />
                </Suspense>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16 md:mb-20">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
              Simple. Beautiful. Delicious.
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Sparkles,
                image: FEATURE_IMAGES.discover,
                step: '01',
                title: 'Discover',
                description: 'Browse our curated collection of breakfast recipes or create your own culinary masterpieces.',
              },
              {
                icon: Calendar,
                image: FEATURE_IMAGES.plan,
                step: '02',
                title: 'Plan',
                description: 'Organize your weekly breakfast schedule with our intuitive drag-and-drop planner.',
              },
              {
                icon: ChefHat,
                image: FEATURE_IMAGES.enjoy,
                step: '03',
                title: 'Enjoy',
                description: 'Wake up each morning knowing exactly what delicious breakfast awaits you.',
              },
            ].map((feature, index) => (
              <StaggerItem key={index}>
                <div className="group relative">
                  {/* Image */}
                  <div className="relative aspect-[4/3] mb-6 rounded-2xl overflow-hidden">
                    <OptimizedImage
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-4xl font-light text-white/80">{feature.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-foreground/60" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
              Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight">
              Morning Inspiration
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BREAKFAST_RECIPES.slice(0, 4).map((recipe, index) => (
              <StaggerItem key={recipe.id}>
                <motion.div
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <OptimizedImage
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                      <h3 className="text-white font-medium text-sm">{recipe.title}</h3>
                      <p className="text-white/70 text-xs">{recipe.prepTime}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 tracking-tight">
              Ready to transform your mornings?
            </h2>
            <p className="text-background/70 mb-10 text-lg leading-relaxed">
              Join thousands of breakfast enthusiasts who have made their mornings more delicious and organized.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/planner">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 py-6 text-base font-medium"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/recipes">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium border-background/30 text-background hover:bg-background/10"
                >
                  Browse Recipes
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
