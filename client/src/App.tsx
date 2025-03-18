import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { useAuth } from "./hooks/use-auth";

// Lazy load these components to improve initial load time
import HomePage from "@/pages/home-page.jsx";
import AuthPage from "@/pages/auth-page.jsx";
import ProfilePage from "@/pages/profile-page.jsx";

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/auth";
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={HomePage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router />
    </div>
  );
}

export default App;
