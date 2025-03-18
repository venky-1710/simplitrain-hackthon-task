import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <i className="ri-loader-2-line animate-spin text-4xl text-gray-500"></i>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
