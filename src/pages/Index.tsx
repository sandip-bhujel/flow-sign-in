import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
        
        {user ? (
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">
              Hello, {user.email}! You are signed in.
            </p>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">
              Please sign in to continue
            </p>
            <Button asChild>
              <Link to="/auth">Sign In / Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
