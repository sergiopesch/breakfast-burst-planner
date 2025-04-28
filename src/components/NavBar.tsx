
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Coffee, LogOut, User, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserName } from '@/utils/getUserName';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing",
      description: "Reloading application data...",
    });
    
    // Use window.location.reload() to perform a full page refresh
    window.location.reload();
  };
  
  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Coffee className="h-6 w-6 text-[#4F2D9E]" />
          <span className="font-medium text-xl text-[#4F2D9E]">Breakfast Planner</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            className="text-[#4F2D9E] hover:bg-[#4F2D9E]/10"
            title="Refresh application"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <Link to="/planner">
            <Button variant="ghost" className="text-[#4F2D9E] hover:bg-[#4F2D9E]/10">
              Meal Planner
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#4F2D9E] text-[#4F2D9E]">
                  <User className="h-4 w-4 mr-2" />
                  {user.email?.split('@')[0] || getUserName()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-[#4F2D9E] hover:bg-[#3D2277]">
                Sign in with Google
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
