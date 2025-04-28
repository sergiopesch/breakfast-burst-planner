
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getUserDisplayName, getUserInitials } from "@/utils/getUserName";
import { Link, useNavigate } from "react-router-dom";
import MainNav from './MainNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
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
    <header className="border-b shadow-sm bg-white sticky top-0 z-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className={`text-xl ${theme.fonts.heading} bg-gradient-to-r from-[${theme.colors.primary}] to-[${theme.colors.secondary}] text-transparent bg-clip-text`}>
              MealPlan
            </span>
          </Link>
          
          {user && <MainNav />}
        </div>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2" size="sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-[#4F2D9E] text-white">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{userDisplayName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userDisplayName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={() => navigate('/login')}
            className="bg-[#4F2D9E] hover:bg-[#3D1C8F] transition-colors"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
