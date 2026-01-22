
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getUserDisplayName, getUserInitials } from "@/utils/getUserName";
import { Link, useNavigate } from "react-router-dom";
import MainNav from './MainNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown, Sunrise } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userDisplayName = getUserDisplayName(user);
  const userInitials = getUserInitials(user);

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-30 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <Sunrise className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">
              Breakfast Burst
            </span>
          </Link>

          {user && <MainNav />}
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-brand-purple-lighter/50 transition-colors" size="sm">
                <Avatar className="h-8 w-8 ring-2 ring-brand-purple-lighter ring-offset-2 ring-offset-background">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-purple to-brand-purple-light text-white font-medium text-sm">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block font-medium text-foreground/80">{userDisplayName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass border-white/30 shadow-soft-lg">
              <div className="flex items-center justify-start gap-3 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-purple to-brand-purple-light text-white">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 leading-none">
                  <p className="font-semibold text-foreground">{userDisplayName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer py-2.5 focus:bg-brand-purple-lighter/50">
                <User className="mr-2.5 h-4 w-4 text-brand-purple" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate('/login')}
            className="btn-glow bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-medium px-5 py-2 rounded-xl border-0"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
